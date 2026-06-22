import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";
import type { Database } from "@/integrations/supabase/types";

const PRICE_LOOKUP_KEY = "konsultacja_jednorazowa";

const Input = z.object({
  consultationType: z.enum(["online", "clinic"]),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(30).optional().or(z.literal("")),
  preferredDate: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

type Result = { clientSecret: string } | { error: string };

export const createConsultationCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<Result> => {
    try {
      const env: StripeEnv = data.environment;
      const stripe = createStripeClient(env);
      const priceLookupKey = PRICE_MAP[data.consultationType];

      const prices = await stripe.prices.list({ lookup_keys: [priceLookupKey] });
      if (!prices.data.length) {
        return { error: `Produkt '${priceLookupKey}' nie istnieje w Stripe.` };
      }
      const stripePrice = prices.data[0];

      // Insert pending order
      const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      const { data: order, error: insertErr } = await supabase
        .from("consultation_orders")
        .insert({
          consultation_type: data.consultationType,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          preferred_date: data.preferredDate || null,
          notes: data.notes || null,
          price_id: priceLookupKey,
          amount: stripePrice.unit_amount ?? 0,
          currency: stripePrice.currency,
          status: "pending",
          environment: env,
        })
        .select("id")
        .single();
      if (insertErr || !order) {
        console.error("[consultation] insert failed", insertErr);
        return { error: "Nie udało się zapisać zamówienia." };
      }

      const productId =
        typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer_email: data.email,
        payment_intent_data: { description: product.name },
        metadata: {
          orderId: order.id,
          consultationType: data.consultationType,
        },
      });

      await supabase
        .from("consultation_orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      console.error("[consultation] stripe error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });
