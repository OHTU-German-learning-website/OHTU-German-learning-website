import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";

describe("GET /api/anchors/[anchor_id]", () => {
  useTestDatabase();

  it("should return 200, with empty array, for non-existent anchor", async () => {
    const { mockGet } = useTestRequest();

    const response = await GET(mockGet("/api/anchors/non-existent"), {
      params: { anchor_id: "-1" },
    });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual([]);
  });

  it("should return exercises for an existing anchor", async () => {
    const { mockGet } = useTestRequest();

    const anchor = await TestFactory.anchor({ anchor_id: "test-anchor" });

    const exercise1 = await TestFactory.exercise({ category: "dnd" });
    const exercise2 = await TestFactory.exercise({ category: "free_form" });

    await TestFactory.exerciseAnchor({
      exercise_id: exercise1.id,
      anchor_id: anchor.id,
      position: 0,
    });

    await TestFactory.exerciseAnchor({
      exercise_id: exercise2.id,
      anchor_id: anchor.id,
      position: 1,
    });

    const response = await GET(mockGet(`/api/anchors/test-anchor`), {
      params: { anchor_id: "test-anchor" },
    });

    expect(response.status).toBe(200);
    const exercises = await response.json();

    expect(exercises).toHaveLength(2);
    expect(exercises[0].id).toBe(exercise1.id);
    expect(exercises[0].category).toBe("dnd");
    expect(exercises[1].id).toBe(exercise2.id);
    expect(exercises[1].category).toBe("free_form");
  });
});
