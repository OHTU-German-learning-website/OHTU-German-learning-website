import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(
  async (request) => {
    try {
      const body = await request.json();
      const { title, description, pairs } = body;
      const createdBy = request.user.id;

      if (
        !title ||
        !description ||
        !Array.isArray(pairs) ||
        pairs.length === 0
      ) {
        return NextResponse.json(
          { error: "Titel, Beschreibung und Paare sind erforderlich." },
          { status: 400 }
        );
      }

      const trimmedPairs = pairs.map((pair) => ({
        left_item: String(pair.left_item || "").trim(),
        right_item: String(pair.right_item || "").trim(),
      }));

      if (trimmedPairs.some((pair) => !pair.left_item || !pair.right_item)) {
        return NextResponse.json(
          {
            error:
              "Alle Paare müssen sowohl ein links als auch ein rechts Element haben.",
          },
          { status: 422 }
        );
      }

      const result = await DB.transaction(async (tx) => {
        const exerciseResult = await tx.query(
          `INSERT INTO exercises (created_by, category)
           VALUES ($1, 'memory_game')
           RETURNING id`,
          [createdBy]
        );

        const exerciseId = exerciseResult.rows[0].id;

        const memoryResult = await tx.query(
          `INSERT INTO memory_game_exercises
           (exercise_id, created_by, title, description)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [exerciseId, createdBy, title, description]
        );

        const memoryGameId = memoryResult.rows[0].id;

        for (let i = 0; i < trimmedPairs.length; i += 1) {
          const pair = trimmedPairs[i];
          await tx.query(
            `INSERT INTO memory_game_pairs
             (memory_game_exercise_id, left_item, right_item, pair_order)
             VALUES ($1, $2, $3, $4)`,
            [memoryGameId, pair.left_item, pair.right_item, i + 1]
          );
        }

        return memoryGameId;
      });

      return NextResponse.json({ id: result }, { status: 201 });
    } catch (error) {
      console.error("Error creating memory game exercise:", error);
      return NextResponse.json(
        { error: "Fehler beim Erstellen der Übung." },
        { status: 500 }
      );
    }
  },
  { requireAuth: true, requireAdmin: true }
);
