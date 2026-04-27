import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { z } from "zod";

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

    const apiKey = process.env.MAILERSEND_API_KEY;
    const fromEmail = process.env.TALKBACK_FROM_EMAIL;
    const fromName = process.env.TALKBACK_FROM_NAME || "GRADESA 2.0";

    if (!apiKey || !fromEmail) {
      return Response.json(
        {
          message: "Der E-Mail-Dienst ist nicht konfiguriert.",
        },
        { status: 500 }
      );
    }

    const mailersend = new MailerSend({ apiKey });
    const sentFrom = new Sender(fromEmail, fromName);
    const recipients = [new Recipient(email, "Talkback Empfänger")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setText(message)
      .setHtml(`<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`);

    await mailersend.email.send(emailParams);

    return Response.json({
      message: "Feedback erfolgreich gesendet.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Feedback konnte nicht gesendet werden.";

    return Response.json(
      {
        message,
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
