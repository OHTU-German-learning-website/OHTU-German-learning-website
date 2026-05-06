import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { dndMatchCreateSchema } from "@/shared/schemas/dnd-match.schemas";

export const POST = withAuth(
  async (request) => {
    try {
      const body = await request.json();
      const parsed = dndMatchCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: parsed.error.issues[0]?.message || "Ungültige Eingabe.",
            issues: parsed.error.issues,
          },
          { status: 422 }
        );
      }

      const { title, description, pairs } = parsed.data;
      const createdBy = request.user.id;

      const result = await DB.transaction(async (tx) => {
        const exerciseRes = await tx.query(
          `INSERT INTO exercises (created_by, category)
           VALUES ($1, 'dnd_match')
           RETURNING id`,
          [createdBy]
        );
        const exerciseId = exerciseRes.rows[0].id;

        const matchRes = await tx.query(
          `INSERT INTO dnd_match_exercises (exercise_id, created_by, title, description)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [exerciseId, createdBy, title, description]
        );
        const matchId = matchRes.rows[0].id;

        for (let i = 0; i < pairs.length; i++) {
          await tx.query(
            `INSERT INTO dnd_match_pairs
               (dnd_match_exercise_id, left_item, right_item, pair_order)
             VALUES ($1, $2, $3, $4)`,
            [matchId, pairs[i].leftItem, pairs[i].rightItem, i + 1]
          );
        }

        return { id: matchId, exerciseId };
      });

      return NextResponse.json(
        { id: result.id, exercise_id: result.exerciseId },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating dnd_match exercise:", error);
      return NextResponse.json(
        { error: "Fehler beim Erstellen der Übung." },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true, requireAuth: true }
);
