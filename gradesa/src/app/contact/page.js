"use client";

import "./contact.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/shared/utils/basePath";
import { useUser } from "@/context/user.context";

export default function ContactPage() {
  const {
    auth: { isLoggedIn, isAuthResolved },
  } = useUser();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Show nothing while session is being resolved, or if not logged in.
  // Middleware already redirects unauthenticated requests to /auth/register.
  if (!isAuthResolved || !isLoggedIn) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Nachricht ist erforderlich.");
      return;
    }

    try {
      setIsSending(true);

      const response = await fetch(withBasePath("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Nachricht konnte nicht gesendet werden."
        );
      }

      setMessage("");
      alert("Nachricht erfolgreich gesendet.");
    } catch (requestError) {
      setError(requestError.message || "Etwas ist schief gelaufen.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="talkback-container">
      <div className="talkback-box">
        <h2 className="auth-title talkback-title">
          Kontaktieren Sie unser Team
        </h2>
        <p className="talkback-description">
          Bitte vergessen Sie Ihre <strong>eigene E-Mail-Adresse</strong> nicht,
          damit wir Ihnen antworten können.
        </p>

        {error && <p className="error">{error}</p>}

        <form className="talkback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <label className="form-label" htmlFor="contact-message">
              Nachricht
            </label> */}
            <textarea
              className="form-input talkback-message-input"
              id="contact-message"
              placeholder="Nachricht eingeben..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={8}
            />
          </div>

          <Button
            className="form-button"
            type="submit"
            size="md"
            width="full"
            disabled={isSending}
          >
            {isSending ? "Senden..." : "Nachricht senden"}
          </Button>
        </form>
      </div>
    </section>
  );
}
