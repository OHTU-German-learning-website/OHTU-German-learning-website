"use client";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const request = useRequest();

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      await request("admin/add-admin", { email });
      setError(null); // nollaa virhe jos onnistuu
    } catch (err) {
      setError(err.message || "Tuntematon virhe");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="email@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <Button type="submit">Submit</Button>

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </form>
  );
}
