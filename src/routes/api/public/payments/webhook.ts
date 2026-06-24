import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { internalSendEmail } from "@/lib/email/internal-send.server";
import { logAuditEvent } from "@/lib/audit/log.server";
import type { Database } from "@/integrations/supabase/types";

const SITE_URL = "https://bmclinics.ai";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return _supabase;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[webhook] checkout.session.completed without orderId metadata", session.id);
    return;
  }

  const supabase = getSupabase();
  const { data: order, error: loadErr } = await supabase
    .from("consultation_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (loadErr || !order) {
    console.error("[webhook] order not found", orderId, loadErr);
    return;
  }
  if (order.status === "paid" && order.email_sent_at) {
    return; // idempotent
  }

  const intakeToken = (order.intake_token as string | null) ?? generateToken();
  await supabase
    .from("consultation_orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      intake_token: intakeToken,
      environment: env,
    })
    .eq("id", orderId);

  try {
    await internalSendEmail({
      templateName: "consultation-intake",
      recipientEmail: order.email as string,
      idempotencyKey: `consultation-intake-${order.id}`,
      templateData: {
        name: order.full_name,
        consultationType: order.consultation_type,
        appointmentDate: order.preferred_date ?? undefined,
        intakeFormUrl: `${SITE_URL}/formularz/${intakeToken}`,
        siteUrl: SITE_URL,
      },
    });
    await supabase
      .from("consultation_orders")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", orderId);
  } catch (e) {
    console.error("[webhook] failed to send intake email", e);
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
    case "transaction.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    default:
      console.log("[webhook] unhandled event", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("[webhook] invalid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("[webhook] error", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
