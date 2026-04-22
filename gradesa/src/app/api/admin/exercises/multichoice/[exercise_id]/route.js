import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

const validateContent = (content) => {
  if (!Array.isArray(content) || content.length === 0) {
    return "Inhalt erforderlich.";
  }

  for (const item of content) {
    if (!item.type) {
      return "Jedes Content-Item benötigt einen Typ.";
    }

    if (item.type === "text" && !item.value) {
      return "Text-Blöcke benötigen einen Wert.";
    }

    if (item.type === "gap" && !item.correct) {
      return "Lücken benötigen eine korrekte Antwort.";
    }

    if (item.type === "multichoice") {
      if (!Array.isArray(item.options) || item.options.length < 2) {
        return "Multiple-Choice Felder benötigen mindestens zwei Optionen.";
      }

      if (!item.correct) {
        return "Multiple-Choice Felder benötigen eine korrekte Antwort.";
      }
    }
  }

  return null;
};

const saveContent = async (tx, multichoiceExerciseId, content) => {
  let order = 1;

  for (const item of content) {
    const contentRes = await tx.query(
      `INSERT INTO multichoice_content
       (multichoice_exercise_id, content_type, content_value, content_order, correct_answer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        multichoiceExerciseId,
        item.type,
        item.value || "",
        order,
        item.type === "multichoice" || item.type === "gap"
          ? item.correct
          : null,
      ]
    );

    const contentId = contentRes.rows[0].id;

    if (item.type === "multichoice") {
      for (const option of item.options) {
        await tx.query(
          `INSERT INTO multichoice_options
           (multichoice_content_id, option_value)
           VALUES ($1, $2)`,
          [contentId, option]
        );
      }
    }

    order++;
  }
};

export const GET = withAuth(
  async (request, { params }) => {
    try {
      const { exercise_id } = await params;

      const exerciseResult = await DB.pool(
        "SELECT * FROM multichoice_exercises WHERE id = $1",
        [exercise_id]
      );
      const exercise = exerciseResult.rows[0];

      if (!exercise) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      const contentResult = await DB.pool(
        "SELECT * FROM multichoice_content WHERE multichoice_exercise_id = $1 ORDER BY content_order",
        [exercise_id]
      );
      const content = contentResult.rows;

      let options = [];
      if (content.length > 0) {
        const contentIds = content.map((item) => item.id);
        const optionsResult = await DB.pool(
          "SELECT * FROM multichoice_options WHERE multichoice_content_id = ANY($1::bigint[])",
          [contentIds]
        );
        options = optionsResult.rows;
      }

      const contentWithOptions = content.map((item) => {
        if (item.content_type === "multichoice") {
          return {
            ...item,
            options: options
              .filter((option) => option.multichoice_content_id === item.id)
              .map((option) => option.option_value),
          };
        }

        return item;
      });

      return NextResponse.json({
        ...exercise,
        content: contentWithOptions,
      });
    } catch (error) {
      console.error("Error fetching multichoice exercise:", error);
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
      const { exercise_id } = await params;
      const body = await request.json();
      const { title, content } = body;

      if (!title) {
        return NextResponse.json(
          { error: "Titel erforderlich." },
          { status: 400 }
        );
      }

      const validationError = validateContent(content);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 422 });
      }

      await DB.transaction(async (tx) => {
        const existingExercise = await tx.query(
          "SELECT id FROM multichoice_exercises WHERE id = $1",
          [exercise_id]
        );

        if (existingExercise.rows.length === 0) {
          throw new Error("Exercise not found");
        }

        const duplicateTitle = await tx.query(
          "SELECT id FROM multichoice_exercises WHERE title = $1 AND id <> $2",
          [title, exercise_id]
        );

        if (duplicateTitle.rows.length > 0) {
          const duplicateError = new Error("duplicate title");
          duplicateError.code = "DUPLICATE_TITLE";
          throw duplicateError;
        }

        await tx.query(
          `UPDATE multichoice_exercises
           SET title = $1, updated_at = NOW()
           WHERE id = $2`,
          [title, exercise_id]
        );

        await tx.query(
          "DELETE FROM multichoice_content WHERE multichoice_exercise_id = $1",
          [exercise_id]
        );

        await saveContent(tx, exercise_id, content);
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.code === "DUPLICATE_TITLE") {
        return NextResponse.json(
          { error: "Eine Übung mit diesem Titel existiert bereits." },
          { status: 409 }
        );
      }

      if (error.message === "Exercise not found") {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      console.error("Error updating multichoice exercise:", error);
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
      const { exercise_id } = await params;

      const { rows } = await DB.pool(
        `SELECT exercise_id
         FROM multichoice_exercises
         WHERE id = $1`,
        [exercise_id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      await DB.pool("DELETE FROM exercises WHERE id = $1", [
        rows[0].exercise_id,
      ]);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting multichoice exercise:", error);
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
