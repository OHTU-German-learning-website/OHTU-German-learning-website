"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (passwords.password.length < 7) {
      setError("Too short, password must be atleast 7 characters long");
      return;
    }
    if (passwords.password !== passwords.confirmPassword) {
      setError("the 2 password fields did not match");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Change Password</h1>
        </div>

        {success ? (
          <div className="success">
            <p>Password successfully updated!</p>
            <p style={{ marginTop: "8px" }}>
              New password: {passwords.password}
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              className="input"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="input"
            />

            {error && <div className="error">{error}</div>}

            <button type="submit" className="button">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
