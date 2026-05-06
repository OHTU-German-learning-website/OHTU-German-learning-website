import { z } from "zod";

function trimmed(schema) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    schema
  );
}

export const dndMatchPairSchema = z.object({
  leftItem: trimmed(
    z.string().min(1, { message: "Linkes Element ist erforderlich." })
  ),
  rightItem: trimmed(
    z.string().min(1, { message: "Rechtes Element ist erforderlich." })
  ),
});

export const dndMatchCreateSchema = z.object({
  title: trimmed(
    z
      .string()
      .min(3, { message: "Titel müssen mindestens 3 Zeichen lang sein." })
      .max(150, { message: "Titel darf maximal 150 Zeichen lang sein." })
  ),
  description: trimmed(
    z.string().min(1, { message: "Beschreibung ist erforderlich." }).max(1000, {
      message: "Beschreibung darf maximal 1000 Zeichen lang sein.",
    })
  ),
  pairs: z
    .array(dndMatchPairSchema)
    .min(2, { message: "Mindestens zwei Paare sind erforderlich." }),
});

export const dndMatchSubmitSchema = z.object({
  answers: z
    .array(
      z.object({
        leftPairId: z.coerce.number().int().positive(),
        selectedRightPairId: z.coerce.number().int().positive(),
      })
    )
    .min(1, { message: "Mindestens eine Antwort ist erforderlich." }),
});
