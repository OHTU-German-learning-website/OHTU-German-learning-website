import { z } from "zod";
import { withAuth } from "@/backend/middleware/withAuth";
import sendEmail from "@/backend/mailService";

const contactSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Nachricht ist erforderlich.")
    .max(2000, "Nachricht ist zu lang."),
});

export const POST = withAuth(
  async (req) => {
    try {
      const body = await req.json();
      const result = contactSchema.safeParse(body);

      if (!result.success) {
        return Response.json(
          { message: result.error.issues[0]?.message || "Ungültige Eingabe." },
          { status: 400 }
        );
      }

      const { message } = result.data;
      const contactEmail = process.env.CONTACT_EMAIL;

      if (!contactEmail) {
        return Response.json(
          { message: "Kontakt-E-Mail ist nicht konfiguriert." },
          { status: 500 }
        );
      }

      await sendEmail({
        to: contactEmail,
        subject: "Kontaktieren Sie uns",
        text: message,
      });

      return Response.json({ message: "Nachricht erfolgreich gesendet." });
    } catch (error) {
      return Response.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Nachricht konnte nicht gesendet werden.",
        },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requireAdmin: false,
  }
);
