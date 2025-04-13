"use client";

import { useState, useEffect } from "react";
import { getUserFromSession } from "@/lib/auth"; // Adjust according to your auth system
import { hashPassword, verifyPassword } from "@/lib/password"; // Use bcrypt helpers

import { DB } from "../../../backend/db";
import { useState } from "react";

export async function POST(req) {
  const { currentPassword, newPassword } = await req.json();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/edit_info");

      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    getUser();
  }, [router]);

  if (user == null) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    return new Response(
      JSON.stringify({ message: "Incorrect current password" }),
      {
        status: 400,
      }
    );
  }

  const hashed = await hashPassword(newPassword);

  await DB.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return new Response(JSON.stringify({ message: "Password updated" }), {
    status: 200,
  });
}
