import { z } from "zod";

export const answerSchema = z.object({
  answer: z.string().min(1, { message: "Answer is required" }),
  feedback: z
    .string()
    .max(1000, { message: "Feedback is too long" })
    .optional(),
  is_correct: z.boolean(),
});

export const questionSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answers: z
    .array(answerSchema)
    .min(1, { message: "At least one answer is required" }),
});

export const freeFormExerciseSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, { message: "At least one question is required" }),
});
