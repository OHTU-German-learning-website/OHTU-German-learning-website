import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("create dnd_exercises API", () => {
  useTestDatabase();

  it("should create a new dnd_exercise with valid details", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/dragdrop", {
        title: "Drag and Drop Exercise",
        fields: [
          {
            color: "red",
            category: "Der",
            content: "Elefant",
          },
          {
            color: "green",
            category: "Das",
            content: "Auto, Haus",
          },
        ],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toBeDefined();
    expect(json.id).toBeDefined();

    const exercise = await DB.pool(
      `SELECT * FROM dnd_exercises WHERE id = $1`,
      [json.id]
    );
    expect(exercise.rows.length).toBe(1);
  });
  it("should return 400 if required fields are missing", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/dragdrop", {
        title: "Drag and Drop Exercise",
        fields: [
          {
            color: "red",
            category: "Der",
            content: "Elefant",
          },
        ],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toMatch(/Felder sind erforderlich/);
  });
});
