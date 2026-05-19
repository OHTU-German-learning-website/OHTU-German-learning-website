const PATE_URL = "https://api-toska.apps.ocp-prod-0.k8s.it.helsinki.fi/pate/";
const isDevelopment = process.env.NODE_ENV === "development";
const isCI = process.env.CI === "true";

const settings = {
    hideToska: false,
    disableToska: true,
    color: "orange",
    header: "GRADESA",
    headerFontColor: "white",
    dryrun: false,
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
        const response = await fetch(`${PATE_URL}?token=${process.env.PATE_TOKEN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mail),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`PATE email sending failed with status ${response.status}: ${errorBody}`);
        }
    } catch (error) {
        console.error("PATE fetch error:", error);
        throw error;
    }
};

export default sendEmail;