import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("create click_exercises API", () => {
  useTestDatabase();

  it("should create a new click_exercise with valid details", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toBeDefined();
    expect(json.id).toBeDefined();

    const exercise = await DB.pool(
      `SELECT * FROM click_exercises WHERE id = $1`,
      [json.id]
    );
    expect(exercise.rows.length).toBe(1);
  });
  it("should return 400 if required fields are missing", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Alle Felder sind erforderlich.");
  });
  it("should return 422 if title is too short", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "a",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Der Titel muss zwischen 3 und 50 Zeichen lang sein."
    );
  });
  it("should return 422 if title is too long", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "a".repeat(51),
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Der Titel muss zwischen 3 und 50 Zeichen lang sein."
    );
  });
  it("should return 422 if targetCategory is too short", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "a",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Die Kategorie muss zwischen 3 und 30 Zeichen lang sein."
    );
  });
  it("should return 422 if targetCategory is too long", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "a".repeat(31),
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Die Kategorie muss zwischen 3 und 30 Zeichen lang sein."
    );
  });
  it("should return 422 if targetWords is empty", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: [],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Es müssen zwischen 1 und 1000 Zielwörter vorhanden sein."
    );
  });
  it("should return 422 if targetWords is too long", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: Array(1001).fill("a"),
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );
    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Es müssen zwischen 1 und 1000 Zielwörter vorhanden sein."
    );
  });
  it("should return 422 if allWords is empty", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: [],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Es müssen zwischen 1 und 1000 Wörter vorhanden sein."
    );
  });
  it("should return 422 if allWords is too long", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: Array(1001).fill("a"),
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toBe(
      "Es müssen zwischen 1 und 1000 Wörter vorhanden sein."
    );
  });
  it("should return 409 if exercise with the same title already exists", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    // Create the first exercise
    await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    // Try to create a second exercise with the same title
    const response = await POST(
      mockPost("api/exercises/create/click", {
        title: "Verben identifizieren",
        targetCategory: "Verben",
        targetWords: ["laufen", "springen", "schwimmen"],
        allWords: ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(409);
    const json = await response.json();
    expect(json.error).toBe("Eine Übung mit diesem Titel existiert bereits.");
  });
});
