"use client";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const request = useRequest();

  const handleSubmit = async function () {
    try {
      const _ = await request("admin/add-admin", {
        email: email,
      }); // Tässä pitäisi todennäköisesti tapahtua jotain nextjs magiaa tolla router.push komennolla
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        placeholder="email@example.com"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <br></br>
      <Button type="submit">{"Submit"}</Button>
    </form>
  );
}
