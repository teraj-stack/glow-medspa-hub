import { supabase } from "@/integrations/supabase/client";

export interface SendTransactionalEmailInput {
  templateName: string;
  recipientEmail: string;
  idempotencyKey?: string;
  templateData?: Record<string, unknown>;
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  const res = await fetch("/lovable/email/transactional/send", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Email send failed (${res.status}): ${text}`);
  }
  return res.json().catch(() => ({}));
}
