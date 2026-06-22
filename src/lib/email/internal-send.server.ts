// Server-only helper to send a transactional email from internal server code
// (webhooks, cron) without requiring a Supabase user JWT. Mirrors the queue
// path used by /lovable/email/transactional/send.
import * as React from "react";
import { render } from "@react-email/render";
import { createClient } from "@supabase/supabase-js";
import { TEMPLATES } from "@/lib/email-templates/registry";

const SITE_NAME = "glow-medspa-hub";
const SENDER_DOMAIN = "notify.bmclinics.ai";
const FROM_DOMAIN = "notify.bmclinics.ai";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface InternalSendInput {
  templateName: string;
  recipientEmail: string;
  idempotencyKey?: string;
  templateData?: Record<string, any>;
}

export async function internalSendEmail(input: InternalSendInput) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Email infrastructure not configured");
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const template = TEMPLATES[input.templateName];
  if (!template) throw new Error(`Template '${input.templateName}' not found`);

  const recipient = template.to || input.recipientEmail;
  if (!recipient) throw new Error("recipientEmail required");

  const messageId = crypto.randomUUID();
  const idempotencyKey = input.idempotencyKey || messageId;
  const data = input.templateData ?? {};

  // Suppression check
  const { data: suppressed } = await supabase
    .from("suppressed_emails")
    .select("id")
    .eq("email", recipient.toLowerCase())
    .maybeSingle();
  if (suppressed) {
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: input.templateName,
      recipient_email: recipient,
      status: "suppressed",
    });
    return { success: false, reason: "email_suppressed" as const };
  }

  // Unsubscribe token
  const normalized = recipient.toLowerCase();
  let unsubscribeToken: string;
  const { data: existingToken } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalized)
    .maybeSingle();

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token as string;
  } else {
    unsubscribeToken = generateToken();
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: unsubscribeToken, email: normalized },
        { onConflict: "email", ignoreDuplicates: true },
      );
    const { data: stored } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalized)
      .maybeSingle();
    if (stored?.token) unsubscribeToken = stored.token as string;
  }

  const element = React.createElement(template.component, data);
  const html = await render(element);
  const plainText = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(data) : template.subject;

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: input.templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: "transactional",
      label: input.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });
  if (error) {
    await supabase
      .from("email_send_log")
      .update({ status: "failed", error_message: error.message })
      .eq("message_id", messageId);
    throw new Error(`Failed to enqueue email: ${error.message}`);
  }
  return { success: true as const, messageId };
}
