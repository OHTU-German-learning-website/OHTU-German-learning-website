"use client";
import "../auth/auth.css";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const makeRequest = useRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/talkback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, complaint }),
      });

      const data = await response.json(); // Extract JSON response

      if (!response.ok) {
        throw new Error(data.message || "An unexpected error occurred.");
      }

      setSubmitted(true);
      setEmail("");
      setComplaint("");

      setTimeout(() => {
        router.push("/talkback");
      }, 2000);
      setError("");
    } catch (error) {
      setError(error.message);
      setSubmitted(false);
    }
  };

  const successMessage = () => {
    return (
      <div className="success-message">
        <p>Feedback erfolgreich gesendet</p>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  };

  return (
    <>
      <h1 className="auth-title">Talk back</h1>
      {!!error && errorMessage()}
      {submitted && successMessage()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            E-Mail-Adresse
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="complaint">
            Feedback/talkback
          </label>
          <textarea
            className="form-input"
            type="complaint"
            id="complaint"
            name="complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
        </div>

        <Button
          className="form-button"
          onClick={handleSubmit}
          type="submit"
          size="md"
          width={"full"}
        >
          Send message
        </Button>
      </form>
    </>
  );
}
