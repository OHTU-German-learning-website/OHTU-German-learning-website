"use client";

import "./talkback.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TalkbackPage() {
  const defaultSubject = "Rückmeldung von GRADESA 2.0";

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim() || defaultSubject;
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      setError("Die E-Mail-Adresse des Empfängers ist erforderlich.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse des Empfängers ein.");
      return;
    }

    if (!trimmedMessage) {
      setError("Nachricht ist erforderlich.");
      return;
    }

    try {
      setIsSending(true);

      const response = await fetch("/api/talkback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Nachricht konnte nicht gesendet werden.");
      }

      setMessage("");
      alert("Feedback erfolgreich gesendet.");
    } catch (requestError) {
      setError(requestError.message || "Etwas ist schief gelaufen.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="talkback-container">
      <div className="talkback-box">
        <h1 className="auth-title">Rückmeldekanal-Feedback geben</h1>

        {error && <p className="error">{error}</p>}

        <form className="talkback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="talkback-email">
              E-Mail-Adresse des Empfängers
            </label>
            <input
              className="form-input"
              id="talkback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="talkback-subject">
              Betreff
            </label>
            <input
              className="form-input"
              id="talkback-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="talkback-message">
              Nachricht
            </label>
            <textarea
              className="form-input talkback-message-input"
              id="talkback-message"
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
