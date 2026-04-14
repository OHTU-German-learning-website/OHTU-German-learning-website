import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("GET /api/admin/grammar-topics", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO grammar_topics (name, sort_order)
       VALUES ($1, $2), ($3, $4), ($5, $6)`,
      ["Z Themen", 10, "A Themen", 1, "M Themen", null]
    );
  });

  it("returns topics sorted by sort_order then name", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockGet } = useTestRequest(admin);

    const response = await GET(mockGet("/api/admin/grammar-topics"));

    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.map((row) => row.name)).toEqual([
      "A Themen",
      "Z Themen",
      "M Themen",
    ]);
  });

  it("returns 401 for non-admin user", async () => {
    const nonAdmin = await TestFactory.user({ is_admin: false });
    const { mockGet } = useTestRequest(nonAdmin);

    const response = await GET(mockGet("/api/admin/grammar-topics"));

    expect(response.status).toBe(401);
  });
});
