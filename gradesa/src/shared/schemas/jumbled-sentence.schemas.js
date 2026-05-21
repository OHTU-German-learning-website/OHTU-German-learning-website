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

function normalizeTokens(sentence) {
  return sentence.trim().split(/\s+/).map(cleanToken).filter(Boolean).sort();
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
  })
  .superRefine((data, ctx) => {
    const baseTokens = normalizeTokens(data.sentence);

    for (let index = 0; index < data.alternates.length; index++) {
      const alternate = data.alternates[index];
      const alternateTokens = normalizeTokens(alternate);

      if (!sameWordSet(baseTokens, alternateTokens)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["alternates", index],
          message:
            "Alternativ-Satz muss genau die gleichen Wörter wie 'Satz (korrekt)' enthalten (nur Reihenfolge darf anders sein).",
        });
      }
    }
  });

export const jumbledSentenceExerciseSchema = z.object({
  title: trimmed(z.string().min(3, { message: "Titel ist erforderlich." })),
  sentences: z
    .array(jumbledSentenceSchema)
    .min(1, { message: "Mindestens ein Satz ist erforderlich." }),
});
