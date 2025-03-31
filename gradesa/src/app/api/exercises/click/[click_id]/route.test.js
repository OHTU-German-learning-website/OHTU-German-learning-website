import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("click_exercises API", () => {
  useTestDatabase();

  it("should return an exercise by click_id", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const exercise = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        "Verben identifizieren",
        "Verben",
        ["laufen", "springen", "schwimmen"],
        ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      ]
    );

    const response = await GET(
      mockGet("api/exercises/click/1"),
      mockParams({ click_id: 1 })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toBeDefined();
    expect(json.title).toBe("Verben identifizieren");
    expect(json.category).toBe("Verben");
    expect(json.target_words).toEqual(["laufen", "springen", "schwimmen"]);
    expect(json.all_words).toEqual([
      "Die",
      "Kinder",
      "laufen",
      "springen",
      "schwimmen",
    ]);
  });

  it("should return 404 for non-existent click_id", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/exercises/click/9999`),
      mockParams({ click_id: 9999 }) // Non-existent ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.message).toBe("Keine Übung gefunden.");
  });

  it("should handle invalid click_id", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/exercises/click/invalid`),
      mockParams({ click_id: "invalid" }) // Invalid ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.message).toBe("Ungültige Übungs-ID.");
  });
});
