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
      mockPost("api/admin/create-exercise/dragdrop", {
        title: "Substantiv",
        fields: [
          { color: "red", category: "die", content: "Zeit, Schule" },
          { color: "blue", category: "der", content: "Elefant" },
          { color: "green", category: "das", content: "Auto" },
        ],
      })
    );

    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toBeDefined();

    const mainExercise = await DB.pool(
      `SELECT * FROM dnd_exercises WHERE id = $1`,
      [json.exerciseId]
    );
    expect(mainExercise.rows.length).toBe(1);

    const dndExercise = await DB.pool(
      `SELECT * FROM dnd_exercises WHERE id = $1`,
      [json.exerciseId]
    );
    expect(dndExercise.rows.length).toBe(1);
    expect(dndExercise.rows[0].title).toBe("Substantiv");
    expect(dndExercise.rows[0].fields).toHaveLength(2);
  });
});
