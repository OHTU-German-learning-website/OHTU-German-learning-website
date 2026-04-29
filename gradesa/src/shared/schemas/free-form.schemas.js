import { z } from "zod";

export const answerSchema = z.object({
  answer: z.string().min(1, { message: "Eine Antwort ist erforderlich." }),
  feedback: z
    .string()
    .max(1000, { message: "Feedback ist zu lang." })
    .optional(),
  is_correct: z.boolean(),
});

export const questionSchema = z.object({
  question: z.string().min(1, { message: "Es wird eine Frage gestellt." }),
  answers: z
    .array(answerSchema)
    .min(1, { message: "Mindestens eine Antwort ist erforderlich." }),
});

export const freeFormExerciseSchema = z.object({
  title: z.string().min(1, { message: "Ein Titel ist erforderlich." }),
  questions: z
    .array(questionSchema)
    .min(1, { message: "Mindestens eine Frage ist erforderlich." }),
});
