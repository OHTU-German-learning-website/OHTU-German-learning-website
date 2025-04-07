import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { DB } from "../../../backend/db";
import { checkSession } from "@/backend/auth/session";

export async function POST(req) {
  try {
    const { email, complaint } = await req.json();

    if (!email || !complaint) {
      return new Response(
        JSON.stringify({ message: "Email and complaint are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const user = await checkSession();
    const userId = user.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401, // Unauthorized
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const lastFeedback = await DB.pool(
      `SELECT timestamp FROM feedbacks WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1`,
      [userId]
    );

    const now = new Date();
    const lastFeedbackTime = lastFeedback.rows[0]?.timestamp;

    if (lastFeedbackTime) {
      const timeDiff = (now - new Date(lastFeedbackTime)) / 1000; // Convert ms to seconds
      const oneHourInSeconds = 3600; // 60 * 60 = 3600 seconds

      if (timeDiff < oneHourInSeconds) {
        console.log("Please wait one hour before submitting another message");
        // User has sent a feedback within the last hour, rate limit applied
        return new Response(
          JSON.stringify({
            message: `Please wait before submitting feedback again. You can try again in ${Math.floor(
              oneHourInSeconds - timeDiff
            )} seconds.`,
          }),
          {
            status: 429, // Too Many Requests
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    await DB.pool(
      `INSERT INTO feedbacks (user_id, email, complaint, timestamp) VALUES ($1,$2,$3,$4)`,
      [userId, email, complaint, now]
    );

    // Initialize MailerSend securely
    const mailersend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY, // changed to env
    });

    // Set up sender (must be from a verified domain)
    const sentFrom = new Sender(
      "MS_rkmRze@trial-p7kx4xw1w08g9yjr.mlsender.net",
      "Test Sender"
    );

    // Set up recipient
    const recipients = [new Recipient("firelyx47@gmail.com", "Recipient")];

    // Create email parameters
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("New Feedback Received")
      .setHtml(
        `<p>New feedback from: ${email}</p><p>Complaint: ${complaint}</p>`
      )
      .setText(`New feedback from: ${email}\nComplaint: ${complaint}`);

    // Send the email
    await mailersend.email.send(emailParams);

    return new Response(
      JSON.stringify({ message: "Feedback received and email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return new Response(
      JSON.stringify({
        message: "Error processing feedback",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
