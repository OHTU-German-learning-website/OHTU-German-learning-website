import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

function validatePayload({ title, targetCategory, targetWords, allWords }) {
  if (!title || !targetCategory || !targetWords || !allWords) {
    return { error: "Alle Felder sind erforderlich.", status: 400 };
  }

  if (title.length < 3 || title.length > 50) {
    return {
      error: "Der Titel muss zwischen 3 und 50 Zeichen lang sein.",
      status: 422,
    };
  }

  if (targetCategory.length < 3 || targetCategory.length > 30) {
    return {
      error: "Die Kategorie muss zwischen 3 und 30 Zeichen lang sein.",
      status: 422,
    };
  }

  if (targetWords.length < 1 || targetWords.length > 1000) {
    return {
      error: "Es müssen zwischen 1 und 1000 Zielwörter vorhanden sein.",
      status: 422,
    };
  }

  if (allWords.length < 1 || allWords.length > 1000) {
    return {
      error: "Es müssen zwischen 1 und 1000 Wörter vorhanden sein.",
      status: 422,
    };
  }

  return null;
}

export const GET = withAuth(
  async (request, { params }) => {
    try {
      const { click_id } = await params;

      const result = await DB.pool(
        `SELECT id, title, category, target_words, all_words, created_at, updated_at
         FROM click_exercises
         WHERE id = $1`,
        [click_id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching click exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const PUT = withAuth(
  async (request, { params }) => {
    try {
      const { click_id } = await params;
      const body = await request.json();
      const { title, targetCategory, targetWords, allWords } = body;

      const validationError = validatePayload({
        title,
        targetCategory,
        targetWords,
        allWords,
      });
      if (validationError) {
        return NextResponse.json(
          { error: validationError.error },
          { status: validationError.status }
        );
      }

      const existingExercise = await DB.pool(
        "SELECT id FROM click_exercises WHERE id = $1",
        [click_id]
      );

      if (existingExercise.rows.length === 0) {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      const duplicateTitle = await DB.pool(
        `SELECT ce.id
         FROM click_exercises ce
         JOIN click_to_exercises cte ON cte.click_id = ce.id
         WHERE LOWER(TRIM(ce.title)) = LOWER(TRIM($1))
           AND ce.id <> $2
         LIMIT 1`,
        [title, click_id]
      );

      if (duplicateTitle.rows.length > 0) {
        return NextResponse.json(
          { error: "Eine Übung mit diesem Titel existiert bereits." },
          { status: 409 }
        );
      }

      await DB.pool(
        `UPDATE click_exercises
         SET title = $1,
             category = $2,
             target_words = $3,
             all_words = $4,
             updated_at = NOW()
         WHERE id = $5`,
        [title, targetCategory, targetWords, allWords, click_id]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error updating click exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const DELETE = withAuth(
  async (request, { params }) => {
    try {
      const { click_id } = await params;

      await DB.transaction(async (tx) => {
        const { rows } = await tx.query(
          `SELECT exercise_id
                     FROM click_to_exercises
                     WHERE click_id = $1`,
          [click_id]
        );

        if (rows.length === 0) {
          throw new Error("CLICK_EXERCISE_NOT_FOUND");
        }

        const exerciseId = rows[0].exercise_id;

        await tx.query(
          `DELETE FROM click_to_exercises
                     WHERE click_id = $1`,
          [click_id]
        );

        await tx.query(
          `DELETE FROM click_exercises
                     WHERE id = $1`,
          [click_id]
        );

        await tx.query("DELETE FROM exercises WHERE id = $1", [exerciseId]);
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.message === "CLICK_EXERCISE_NOT_FOUND") {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      console.error("Error deleting click exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
