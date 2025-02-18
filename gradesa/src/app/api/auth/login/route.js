import { NextResponse } from "next/server";
import { createSession } from "../../../lib/session";

export async function POST(request) {
  const { email, password } = await request.json();

  // Mock user credentials
  const mockEmail = "user@example.com";
  const mockPassword = "Demonstration1";

  if (email !== mockEmail || password !== mockPassword) {
    return NextResponse.json(
      { error: "Ungültige E-Mail-Adresse oder Passwort" },
      { status: 401 }
    );
  }

  // Create a session with mock userId 1
  await createSession(1);

  return NextResponse.json({ message: "Login successful" });
}
