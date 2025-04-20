import { describe, it, expect } from "vitest";
import { POST, GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("POST /api/auth/admin/glossary", () => {
  useTestDatabase();

  it("should create a glossary entry with valid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const validInput = {
      word: "Apfel",
      word_definition: "Ein rundes Obst mit roter, grüner oder gelber Schale.",
    };

    const response = await POST(
      mockPost("/api/auth/admin/glossary", validInput)
    );

    expect(response.status).toBe(200);
    const { entry_id } = await response.json();

    // Verify that an entry in the glossary_entries table was created
    const entryResult = await DB.pool(
      "SELECT * FROM glossary_entries WHERE id = $1",
      [entry_id]
    );
    expect(entryResult.rows.length).toBe(1);
    expect(entryResult.rows[0].word).toBe(validInput.word);
    expect(entryResult.rows[0].word_definition).toBe(
      validInput.word_definition
    );
  });

  it("should return a 422 error for invalid input (missing word)", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const invalidInput = {
      word_definition: "Eine Definition ohne Wort.",
    };

    const response = await POST(
      mockPost("/api/auth/admin/glossary", invalidInput)
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toContain("Required");
  });
});

describe("GET /api/auth/admin/glossary", () => {
  useTestDatabase();

  it("should return all glossary entries", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockGet } = useTestRequest(admin);

    // Create test glossary entries
    await DB.pool(
      "INSERT INTO glossary_entries (word, word_definition) VALUES ($1, $2), ($3, $4)",
      [
        "Haus",
        "Ein Gebäude zum Wohnen.",
        "Auto",
        "Ein Fahrzeug mit vier Rädern.",
      ]
    );

    const response = await GET(mockGet("/api/auth/admin/glossary"));

    expect(response.status).toBe(200);
    const entries = await response.json();

    expect(entries.length).toBe(2);
    expect(entries.some((entry) => entry.word === "Haus")).toBe(true);
    expect(entries.some((entry) => entry.word === "Auto")).toBe(true);
  });
});
