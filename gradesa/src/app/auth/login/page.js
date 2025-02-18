"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "../../../shared/hooks/useRequest";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const request = useRequest();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await request("/auth/login", { email, password });

      if (response.status !== 200) {
        throw new Error(response.data.error);
      }

      console.log("Login successful!");
      router.push("/");
    } catch (error) {
      console.log("Validation failed");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="auth-title">Anmeldung</h1>

      {error && <div className="error-message">{error}</div>}

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? "Wird bearbeitet..." : "Einloggen"}
        </button>
      </form>
    </div>
  );
}
