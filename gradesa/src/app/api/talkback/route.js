import { z } from "zod";
import { sendEmail } from "@/backend/mailService";

const talkbackSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse des Empfängers ein."),
  subject: z
    .string()
    .trim()
    .min(1, "Betreff ist erforderlich.")
    .max(200, "Betreff ist zu lang."),
  message: z
    .string()
    .trim()
    .min(1, "Nachricht ist erforderlich.")
    .max(2000, "Nachricht ist zu lang."),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = talkbackSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: result.error.issues[0]?.message || "Ungültige Eingabe.",
        },
        { status: 400 }
      );
    }

    const { email, subject, message } = result.data;

    await sendEmail({ to: email, subject, body: message });

    return Response.json({
      message: "Nachricht erfolgreich gesendet.",
    });
  } catch {
    return Response.json(
      {
        message: "Nachricht konnte nicht gesendet werden.",
      },
      { status: 500 }
    );
  }
}
