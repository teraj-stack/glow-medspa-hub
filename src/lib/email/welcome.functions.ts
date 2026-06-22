import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  fullName: z.string().trim().min(1).max(200).optional(),
});

// Sends the welcome email to the currently-authenticated user only.
// The recipient is taken from the verified JWT, NOT from client input,
// so this endpoint cannot be abused to send emails to arbitrary addresses.
export const sendWelcomeEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const { internalSendEmail } = await import("./internal-send.server");
    const email = context.claims?.email as string | undefined;
    const userId = context.userId;
    if (!email) return { sent: false as const };

    // loginUrl is hardcoded on the server — never accept it from the client.
    const loginUrl = "https://bmclinics.ai/auth";
    await internalSendEmail({
      templateName: "welcome",
      recipientEmail: email,
      idempotencyKey: `welcome-${userId}`,
      templateData: { name: data.fullName || email, loginUrl },
    });
    return { sent: true as const };
  });
