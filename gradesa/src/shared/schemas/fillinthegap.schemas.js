import { z } from "zod";
import { normalizePlainText } from "@/shared/utils/normalizeEditorText";

function trimmed(schema) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    schema
  );
}

function normalized(schema) {
  return z.preprocess(
    (value) => (typeof value === "string" ? normalizePlainText(value) : value),
    schema
  );
}

export const fillGapAnswerSchema = z.object({
  answer: trimmed(z.string().min(1, { message: "Answer is required" })),
  feedback: trimmed(z.string().min(1, { message: "Feedback is required" })),
  isCorrect: z.boolean(),
});

export const fillGapGapSchema = z
  .object({
    tokenIndex: z.number().int().min(0),
    tokenText: trimmed(
      z.string().min(1, { message: "Gap token text is required" })
    ),
    answers: z
      .array(fillGapAnswerSchema)
      .min(2, { message: "Each gap needs at least two answer options" }),
  })
  .refine((gap) => gap.answers.some((answer) => answer.isCorrect), {
    message: "Each gap needs at least one correct answer",
    path: ["answers"],
  })
  .refine((gap) => gap.answers.some((answer) => !answer.isCorrect), {
    message: "Each gap needs at least one incorrect answer",
    path: ["answers"],
  });

export const fillGapCreateSchema = z.object({
  title: trimmed(
    z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(120, { message: "Title must be at most 120 characters" })
  ),
  text: normalized(z.string().min(1, { message: "Exercise text is required" })),
  textHtml: z.string().optional(),
  gaps: z
    .array(fillGapGapSchema)
    .min(1, { message: "Select at least one gap" }),
});

export const fillGapSubmitSchema = z.object({
  answers: z.array(
    z.object({
      gapId: z.union([z.string(), z.number()]),
      answer: z.string(),
    })
  ),
});
