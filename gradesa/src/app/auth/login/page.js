"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequest } from "@/shared/hooks/useRequest";
import Link from "next/link";
import { useUser } from "@/context/user.context";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const request = useRequest();
  const searchParams = useSearchParams(); // Access query parameters
  const redirectPath = searchParams.get("redirect") || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (identifier === "" || password === "") {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    setIsLoading(true);

    try {
      const response = await request("/auth/login", {
        identifier,
        password,
      });

      if (response.status !== 200) {
        throw new Error(response.data.error);
      }

      // Login successful
      router.push(redirectPath);
    } catch (error) {
      // Failed validation
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const errorMessage = () => {
    return error ? <div className="error-message">{error}</div> : null;
  };

  return (
    <>
      <h1 className="auth-title">Anmeldung</h1>

      <p>Zugriff auf weitere Inhalte durch Anmeldung</p>

      {errorMessage()}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="identifier">
            Benutzername oder E-Mail-Adresse
          </label>
          <input
            className="form-input"
            type="text"
            id="identifier"
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <Button
          className="form-button"
          type="submit"
          size="md"
          width={"full"}
          disabled={isLoading}
        >
          {isLoading ? "Wird bearbeitet..." : "Einloggen"}
        </Button>
      </form>
      <div className="navigate-register">
        <p>
          Noch keinen Account? <Link href="/auth/register">Registrieren</Link>
        </p>
      </div>
    </>
  );
}
