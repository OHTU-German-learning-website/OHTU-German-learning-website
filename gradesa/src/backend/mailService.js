const PATE_URL = "https://api-toska.apps.ocp-prod-0.k8s.it.helsinki.fi/pate/";
const isDevelopment = process.env.NODE_ENV === "development";
const isCI = process.env.CI === "true";

const settings = {
  hideToska: false,
  // Keep disabled only when explicitly requested via env.
  disableToska: process.env.PATE_DISABLE_TOSKA === "true",
  color: "orange",
  header: "GRADESA",
  headerFontColor: "white",
  dryrun: process.env.PATE_DRYRUN === "true",
};

const looksLikeProviderFailure = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (payload.ok === false || payload.success === false) {
    return true;
  }

  if (payload.error || payload.errors || payload.messageType === "error") {
    return true;
  }

  return false;
};

const sendEmail = async ({ to, subject, text }) => {
  if (!to || !subject || !text) {
    throw new Error("Missing email fields: to, subject and text are required");
  }

  const mail = {
    template: {
      from: "GRADESA",
      text,
    },
    emails: [
      {
        to,
        subject,
      },
    ],
    settings,
  };

  if (isCI || isDevelopment) {
    console.info("Skipping email sending in CI/development", {
      to,
      subject,
      nodeEnv: process.env.NODE_ENV,
    });
    return;
  }

  if (!process.env.PATE_TOKEN) {
    throw new Error("PATE_TOKEN missing");
  }

  try {
    const response = await fetch(
      `${PATE_URL}?token=${process.env.PATE_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mail),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `PATE email sending failed with status ${response.status}: ${responseText}`
      );
    }

    let payload;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      payload = null;
    }

    if (looksLikeProviderFailure(payload)) {
      throw new Error(
        `PATE reported email failure: ${payload.message || responseText}`
      );
    }

    if (settings.dryrun) {
      throw new Error(
        "Email sending is configured as dry-run (PATE_DRYRUN=true)."
      );
    }
  } catch (error) {
    console.error("PATE fetch error:", error);
    throw error;
  }
};

export default sendEmail;
