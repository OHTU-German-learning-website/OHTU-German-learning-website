"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function User_settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email", email);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>User Settings</h1>

      {/* Section 1: Password Changing section */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Change Password</h2>
        <p>You can change your password by clicking the button below.</p>
        <Link href="/change-password">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
        </Link>
      </section>

      {/* Section 2: Change Email section */}
      <section>
        <h2>Change Email</h2>
        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="currentEmail"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Current Email:
            </label>
            <input
              type="email"
              id="currentEmail"
              value="user@example.com" // Hardcoded current email
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "5px" }}
            >
              New Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update Email
          </button>
        </form>
      </section>
    </div>
  );
}
