"use client";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const makeRequest = useRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await makeRequest("/auth/register", { email, password });
      setSubmitted(true);
      if (submitted) {
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
      setError("");
    } catch (error) {
      if (error.message === "Account already exists.") {
        setError("Konto ist bereits vorhanden.");
        setSubmitted(false);
      }
      if (error.message === "Email and password are required.") {
        setError("E-Mail und Passwort sind erforderlich.");
        setSubmitted(false);
      }
      if (error.message === "Invalid email address.") {
        setError("Ungültige E-Mail-Adresse.");
        setSubmitted(false);
      }
      if (error.message === "Password must be at least 8 characters long.") {
        setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
        setSubmitted(false);
      }
    }
  };

  const successMessage = () => {
    return (
      <div className="success">
        {!!submitted && <h1>Benutzer erfolgreich registriert</h1>}
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? "" : "none",
        }}
      >
        <h1>{error}</h1>
      </div>
    );
  };

  return (
    <>
      <h1 className="auth-title">Registrieren</h1>
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>

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
          <label className="form-label" htmlFor="password">
            Passwort
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button onClick={handleSubmit} type="submit" className="form-button">
          Registrieren
        </button>
      </form>
    </>
  );
}
