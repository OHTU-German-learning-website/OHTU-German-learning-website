"use client";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      setError(true);
      setSubmitted(false);
    } else {
      setSubmitted(true);
      setError(false);
    }
  };

  const successMessage = () => {
    return submitted ? (
      <div className="success-message">Benutzer {email} erfolgreich registriert</div>
    ) : null;
  };

  const errorMessage = () => {
    return error ? <div className="error-message">Bitte alle Felder ausfüllen</div> : null;
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
