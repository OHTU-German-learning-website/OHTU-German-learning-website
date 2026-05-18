import axios from "axios";

const pateClient = axios.create({
  baseURL: "https://api-toska.apps.ocp-prod-0.k8s.it.helsinki.fi/pate/",
  params: {
    token: process.env.PATE_TOKEN,
  },
});

const template = {
  from: "Gradesa",
};

const settings = {
  color: "orange",
  header: "Sent by Gradesa",
  dryrun: false,
  hideToska: true,
  disableToska: true,
};

export async function sendEmail(to, subject, body) {
  if (!process.env.PATE_TOKEN) {
    throw new Error("PATE token missing");
  }

  return pateClient.post("/", {
    template,
    emails: [
      {
        to,
        subject,
        body,
      },
    ],
    settings,
  });
}
