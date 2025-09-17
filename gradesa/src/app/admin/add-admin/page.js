"use client";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const request = useRequest();

  const handleSubmit = async function () {
    const _ = await request("admin/add-admin", {
      email: email,
    });
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
