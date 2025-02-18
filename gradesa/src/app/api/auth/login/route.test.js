import { describe, it, expect, vi } from "vitest";
import { NextResponse } from "next/server";
import { POST } from "./route";
import { createSession } from "../../../lib/session";

vi.mock("../../../app/lib/session", () => ({
  createSession: vi.fn(),
}));

describe("POST /api/auth/login", () => {
  it("should return success message for valid credentials", async () => {
    const request = {
      json: async () => ({
        email: "user@example.com",
        password: "Demonstration1",
      }),
    };

    const response = await POST(request);

    expect(response).toMatchObject(
      NextResponse.json({ message: "Login successful" })
    );
    expect(createSession).toHaveBeenCalledWith(1);
  });

  it("should return error message for invalid email", async () => {
    const request = {
      json: async () => ({
        email: "wrong@example.com",
        password: "Demonstration1",
      }),
    };

    const response = await POST(request);

    expect(response).toMatchObject(
      NextResponse.json(
        { error: "Ungültige E-Mail-Adresse oder Passwort" },
        { status: 401 }
      )
    );
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should return error message for invalid password", async () => {
    const request = {
      json: async () => ({
        email: "user@example.com",
        password: "wrongpassword",
      }),
    };

    const response = await POST(request);

    expect(response).toMatchObject(
      NextResponse.json(
        { error: "Ungültige E-Mail-Adresse oder Passwort" },
        { status: 401 }
      )
    );
    expect(createSession).not.toHaveBeenCalled();
  });
});
