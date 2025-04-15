import { z } from "zod";

export const glossaryEntrySchema = z.object({
  word: z.string().min(1, "Word is required"),
  word_definition: z.string().min(1, "Definition is required"),
});
