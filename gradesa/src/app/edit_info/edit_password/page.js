"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/shared/utils/basePath";

export default function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    const res = await fetch(withBasePath("/api/edit_password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setSuccess("Passwort erfolgreich geändert!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/edit_info"); // go back to profile page
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.message || "Passwort konnte nicht geändert werden");
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Passwort ändern</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1" htmlFor="currentPassword">
            Aktuelles Passwort
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="w-full border rounded px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="newPassword">
            Neues Passwort
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            className="w-full border rounded px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="confirmPassword">
            Neues Passwort bestätigen
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <Button type="submit">Passwort aktualisieren</Button>{" "}
      </form>
    </Container>
  );
}
