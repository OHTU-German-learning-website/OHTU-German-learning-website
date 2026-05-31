import { z } from "zod";

function trimmed(schema) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    schema
  );
}

function cleanToken(token) {
  return token.replace(/[\p{P}]/gu, "").toLowerCase();
}

function splitElements(sentence) {
  const trimmedSentence = sentence.trim();

  if (!trimmedSentence) return [];

  if (trimmedSentence.includes("\n")) {
    return trimmedSentence
      .split(/\r?\n/)
      .map((element) => element.trim())
      .filter(Boolean);
  }

  return trimmedSentence.split(/\s+/).filter(Boolean);
}

function normalizeElements(sentence) {
  return splitElements(sentence).map(cleanToken).filter(Boolean).sort();
}

function sameWordSet(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const jumbledSentenceSchema = z
  .object({
    sentence: trimmed(z.string().min(2, { message: "Satz ist erforderlich." })),
    alternates: z.preprocess((value) => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => (typeof item === "string" ? item.trim() : item))
        .filter((item) => typeof item === "string" && item.length > 0);
    }, z.array(z.string())),
    alternateFeedbacks: z.preprocess((value) => {
      if (!Array.isArray(value)) return [];
      return value.map((item) => (typeof item === "string" ? item.trim() : ""));
    }, z.array(z.string())),
    correctSentenceFeedback: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : ""),
      z.string()
    ),
    incorrectFeedbacks: z.preprocess((value) => {
      if (!Array.isArray(value)) return [];
      return value.map((item) => (typeof item === "string" ? item.trim() : ""));
    }, z.array(z.string())),
    incorrectAlternates: z.preprocess((value) => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => (typeof item === "string" ? item.trim() : item))
        .filter((item) => typeof item === "string" && item.length > 0);
    }, z.array(z.string())),
  })
  .superRefine((data, ctx) => {
    const baseTokens = normalizeElements(data.sentence);

    if (data.alternateFeedbacks.length !== data.alternates.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["alternateFeedbacks"],
        message: "Jeder Alternativ-Satz kann optional eigenes Feedback haben.",
      });
    }

    for (let index = 0; index < data.alternates.length; index++) {
      const alternate = data.alternates[index];
      const alternateTokens = normalizeElements(alternate);

      if (!sameWordSet(baseTokens, alternateTokens)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["alternates", index],
          message:
            "Alternativ-Satz muss genau die gleichen Wörter wie 'Satz (korrekt)' enthalten (nur Reihenfolge darf anders sein).",
        });
      }
    }

    for (let index = 0; index < data.incorrectAlternates.length; index++) {
      const incorrectAlternate = data.incorrectAlternates[index];
      const incorrectTokens = normalizeElements(incorrectAlternate);

      if (!sameWordSet(baseTokens, incorrectTokens)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["incorrectAlternates", index],
          message:
            "Falsche Alternativ-Antwort muss genau die gleichen Wörter wie 'Satz (korrekt)' enthalten (nur Reihenfolge darf anders sein).",
        });
      }
    }

    if (data.incorrectFeedbacks.length !== data.incorrectAlternates.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["incorrectFeedbacks"],
        message:
          "Jede falsche Alternative kann optional eigenes Feedback haben.",
      });
    }
  });

export const jumbledSentenceExerciseSchema = z.object({
  title: trimmed(z.string().min(3, { message: "Titel ist erforderlich." })),
  sentences: z
    .array(jumbledSentenceSchema)
    .min(1, { message: "Mindestens ein Satz ist erforderlich." }),
});
