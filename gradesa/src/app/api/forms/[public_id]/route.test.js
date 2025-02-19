import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";

describe("Forms", () => {
  useTestDatabase();
  it("should return a form", async () => {
    const { mockGet, mockParams } = useTestRequest();

    const form = await GET(
      mockGet("/api/forms/learning_type"),
      mockParams({ public_id: "learning_type" })
    );
    expect(form).toBeDefined();
    expect(form.status).toBe(200);
    const json = await form.json();
    expect(json.parts).toHaveLength(6);
    expect(json.parts[0].questions).toHaveLength(9);
    expect(json.parts.map((p) => p.step_number)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
