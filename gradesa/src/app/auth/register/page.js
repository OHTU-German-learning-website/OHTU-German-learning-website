"use client";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const makeRequest = useRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await makeRequest("/register", { email, password });
      console.log(data);
      setSubmitted(true);
      setError("");
    } catch (error) {
      if (error.status === 409) {
        setError("Konto ist bereits vorhanden.");
        setSubmitted(false);
      }
      if (error.status === 400) {
        setError("E-Mail und Passwort sind erforderlich.");
        setSubmitted(false);
      }
      if (error.status === 422) {
        setError(
          "Ungültige E-Mail-Adresse oder Passwort zu kurz. (min. 8 Zeichen)"
        );
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
