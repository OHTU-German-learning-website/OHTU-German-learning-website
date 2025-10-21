"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";

export default function EditEmail() {
  const [user, setUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/edit_email", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError("Failed to fetch the current user data");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newEmail !== confirmEmail) {
      setError("E-Mails stimmen nicht überein");
      return;
    }

    const res = await fetch("/api/edit_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newEmail }),
    });

    if (res.ok) {
      setSuccess("E-Mail erfolgreich geändert!");
      setNewEmail("");
      setConfirmEmail("");
      setTimeout(() => {
        router.push("/edit_info");
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.message || "E-Mail konnte nicht geändert werden");
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">E-Mail ändern</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Aktuelle E-Mail</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1">Neue E-Mail-Adresse</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Neue E-Mail bestätigen</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <Button type="submit">E-Mail aktualisieren</Button>
      </form>
    </Container>
  );
}
