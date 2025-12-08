import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(
  async (request) => {
    try {
      const json = await request.json();
      // We extract description but ignore it for the DB save
      const { title, description, content } = json;

      // Validation
      if (!title || !Array.isArray(content) || content.length === 0) {
        return Response.json(
          { error: "Titel und Inhalt erforderlich." },
          { status: 400 }
        );
      }

      // Check for duplicates
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

      const created_by = 1;

      // 1. Insert into parent 'exercises' table
      // FIX: Removed 'description' column. Only saving creator and category.
      const exResult = await DB.pool(
        `INSERT INTO exercises (created_by, category)
         VALUES ($1, 'multichoice')
         RETURNING id`,
        [created_by]
      );
      const exercise_id = exResult.rows[0].id;

      // 2. Insert into multichoice_exercises
      // FIX: Removed 'description' here too. Only saving exercise_id and title.
      const mcRes = await DB.pool(
        `INSERT INTO multichoice_exercises (exercise_id, title)
         VALUES ($1, $2)
         RETURNING id`,
        [exercise_id, title]
      );
      const multichoice_id = mcRes.rows[0].id;

      // Insert content blocks
      let order = 1;
      for (const item of content) {
        // Validation: Only require 'value' if it is a text block.
        if (!item.type || (item.type === "text" && !item.value)) {
          return Response.json(
            { error: "Jedes Content-Item benötigt Typ und Wert." },
            { status: 422 }
          );
        }

        const contentRes = await DB.pool(
          `INSERT INTO multichoice_content
           (multichoice_exercise_id, content_type, content_value, content_order, correct_answer)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            multichoice_id,
            item.type,
            // FIX: Send empty string "" for dropdowns so DB doesn't crash on NULL
            item.value || "",
            order,
            item.type === "multichoice" ? item.correct : null,
          ]
        );

        const content_id = contentRes.rows[0].id;

        // Insert options
        if (item.type === "multichoice") {
          if (!Array.isArray(item.options) || item.options.length < 2) {
            return Response.json(
              {
                error:
                  "Multiple-Choice Felder benötigen mindestens zwei Optionen.",
              },
              { status: 422 }
            );
          }

          for (const opt of item.options) {
            await DB.pool(
              `INSERT INTO multichoice_options
               (multichoice_content_id, option_value)
               VALUES ($1, $2)`,
              [content_id, opt]
            );
          }
        }

        order++;
      }

      // Return the ID as the slug fallback
      return Response.json(
        {
          success: true,
          exerciseId: exercise_id,
          slug: exercise_id.toString(),
        },
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
