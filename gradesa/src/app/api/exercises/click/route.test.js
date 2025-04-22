import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("click_exercises API", () => {
  useTestDatabase();

  it("should return all click exercises", async () => {
    const user = await TestFactory.user();
    const { mockGet } = useTestRequest(user);

    // Insert test exercises into the database
    const exercise1 = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
      [
        "Verben identifizieren",
        "Verben",
        ["laufen", "springen"],
        ["Die", "Kinder", "laufen", "springen"],
      ]
    );

    const exercise2 = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
      [
        "Adjektive erkennen",
        "Adjektive",
        ["schnell", "langsam"],
        ["Der", "Hund", "ist", "schnell", "und", "langsam"],
      ]
    );

    const response = await GET(mockGet("/api/exercises/click"));

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toBeDefined();
    expect(json).toHaveLength(2);

    expect(json[0].title).toBe("Adjektive erkennen");
    expect(json[0].category).toBe("Adjektive");
    expect(json[0].target_words).toEqual(["schnell", "langsam"]);
    expect(json[0].all_words).toEqual([
      "Der",
      "Hund",
      "ist",
      "schnell",
      "und",
      "langsam",
    ]);

    expect(json[1].title).toBe("Verben identifizieren");
    expect(json[1].category).toBe("Verben");
    expect(json[1].target_words).toEqual(["laufen", "springen"]);
    expect(json[1].all_words).toEqual(["Die", "Kinder", "laufen", "springen"]);
  });

  it("should return an empty array if no click exercises exist", async () => {
    const user = await TestFactory.user();
    const { mockGet } = useTestRequest(user);

    const response = await GET(mockGet("/api/exercises/click"));

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toBeDefined();
    expect(json).toHaveLength(0);
  });
});
