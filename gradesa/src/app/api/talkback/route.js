import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

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

    // Initialize MailerSend securely
    const mailersend = new MailerSend({
      apiKey:
        "mlsn.9348398e42d0ba656a212815a4317bdd7f59455df2e1e3fa6343e94adad07354", // pitää muuttaa enviks
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
