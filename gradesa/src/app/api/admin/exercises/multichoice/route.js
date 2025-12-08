import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(
  async (request) => {
    try {
      const json = await request.json();
      const { title, description, content } = json;

      // Validation
      if (
        !title ||
        !content ||
        !Array.isArray(content) ||
        content.length === 0
      ) {
        return Response.json(
          { error: "Titel und Inhalt erforderlich." },
          { status: 400 }
        );
      }

      // Prevent duplicates
      const exists = await DB.pool(
        "SELECT id FROM multichoice_exercises WHERE title = $1",
        [title]
      );
      if (exists.rows.length > 0) {
        return Response.json(
          { error: "Eine Übung mit diesem Titel existiert bereits." },
          { status: 409 }
        );
      }

      // Insert into exercises table
      const exResult = await DB.pool(
        `INSERT INTO exercises (category) VALUES ('multichoice') RETURNING id`
      );
      const exercise_id = exResult.rows[0].id;

      // Insert into multichoice_exercises metadata table
      const mcRes = await DB.pool(
        `INSERT INTO multichoice_exercises (exercise_id, title, exercise_description)
       VALUES ($1, $2, $3)
       RETURNING id`,
        [exercise_id, title, description ?? null]
      );
      const multichoice_id = mcRes.rows[0].id;

      // Insert content rows
      let contentOrder = 1;
      for (const item of content) {
        const contentRes = await DB.pool(
          `INSERT INTO multichoice_content
           (multichoice_exercise_id, content_type, content_value, content_order, correct_answer)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
          [
            multichoice_id,
            item.type,
            item.value ?? "",
            contentOrder,
            item.type === "multichoice" ? item.correct : null,
          ]
        );

        const content_id = contentRes.rows[0].id;

        // Insert options if it is a selection field
        if (item.type === "multichoice" && item.options?.length > 0) {
          for (const option of item.options) {
            await DB.pool(
              `INSERT INTO multichoice_options (multichoice_content_id, option_value)
             VALUES ($1, $2)`,
              [content_id, option]
            );
          }
        }

        contentOrder++;
      }

      return Response.json(
        { success: true, exerciseId: exercise_id },
        { status: 201 }
      );
    } catch (err) {
      console.error("Error saving multichoice exercise:", err);
      return Response.json(
        { error: "Fehler beim Speichern der Übung." },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
