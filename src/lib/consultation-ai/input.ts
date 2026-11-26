import { z } from "zod";

export const consultationInput = z.object({
  needs: z.string().trim().min(20, "Opisz potrzeby w co najmniej 20 znakach.").max(3000, "Opis może mieć maksymalnie 3000 znaków."),
  consent: z.literal(true, { error: "Zgoda na przetwarzanie opisu przez AI jest wymagana." }),
});

export type QuestionEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };