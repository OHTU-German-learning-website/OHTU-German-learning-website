"use client";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const makeRequest = useRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await makeRequest("/auth/register", {
        email,
        password,
        username,
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push("/auth/login");
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
        <p>Benutzer erfolgreich registriert</p>
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
      <h1 className="auth-title">Registrieren</h1>
      {!!error && errorMessage()}
      {submitted && successMessage()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Benutzername
          </label>
          <input
            className="form-input"
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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

        <Button
          className="form-button"
          onClick={handleSubmit}
          type="submit"
          size="md"
          width={"full"}
        >
          Registrieren
        </Button>
      </form>

      <div className="navigate-login">
        <p>
          Bereits registriert? <Link href="/auth/login">Anmelden</Link>
        </p>
      </div>
    </>
  );
}
