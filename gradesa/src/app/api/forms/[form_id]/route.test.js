import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/requests";

describe("Forms", () => {
  useTestDatabase();
  it("should return a form", async () => {
    const { mockGet, mockParams } = useTestRequest();

    const form = await GET(
      mockGet("/api/forms/1"),
      mockParams({ form_id: "1" })
    );
    expect(form).toBeDefined();
    expect(form.status).toBe(200);
    const json = await form.json();
    expect(json.parts).toHaveLength(6);
    expect(json.parts[0].questions).toHaveLength(9);
    expect(json.parts[1].questions).toHaveLength(14);
    expect(json.parts[2].questions).toHaveLength(6);
    expect(json.parts[3].questions).toHaveLength(9);
    expect(json.parts[4].questions).toHaveLength(6);
    expect(json.parts[5].questions).toHaveLength(6);
  });
});
