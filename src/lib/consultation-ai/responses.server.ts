import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

import {
  createLovableAiGatewayRunIdFetch,
} from "./run-id.server.ts";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string; onFailure: (status: number, message: string) => Promise<void> },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  let failure: { status: number; message: string } | undefined;
  let ready: () => void = () => {};
  const upstreamReady = new Promise<void>((resolve) => { ready = resolve; });
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      try {
        const response = await runIdFetch.fetch(input, init);
        if (!response.ok) {
          const body = await response.clone().json().catch(() => null) as { message?: unknown; error?: { message?: unknown } } | null;
          const message = body?.message ?? body?.error?.message;
          failure = { status: response.status, message: typeof message === "string" ? message : "Usługa AI nie może teraz przygotować pytań." };
          await config.onFailure(failure.status, failure.message);
        }
        return response;
      } finally {
        ready();
      }
    },
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    ...(instructions ? { instructions } : {}),
    messages,
    maxRetries: 0,
    onError: () => {}, // Do not log provider errors containing patient request payloads.
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    upstreamReady,
    getFailure: () => failure,
    getRunId: runIdFetch.getRunId,
  };
}
