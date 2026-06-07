import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

const findOrCreateCategory = async (category, color) => {
  const existingCategory = await DB.pool(
    `SELECT id
     FROM dnd_categories
     WHERE category = $1 AND color = $2
     ORDER BY id ASC
     LIMIT 1`,
    [category, color]
  );

  if (existingCategory.rows[0]?.id) {
    return existingCategory.rows[0].id;
  }

  const insertedCategory = await DB.pool(
    `INSERT INTO dnd_categories (category, color)
     VALUES ($1, $2)
     RETURNING id`,
    [category, color]
  );

  return insertedCategory.rows[0].id;
};

const findOrCreateWord = async (word) => {
  const existingWord = await DB.pool(
    `SELECT id
     FROM draggable_words
     WHERE word = $1
     ORDER BY id ASC
     LIMIT 1`,
    [word]
  );

  if (existingWord.rows[0]?.id) {
    return existingWord.rows[0].id;
  }

  const insertedWord = await DB.pool(
    `INSERT INTO draggable_words (word)
     VALUES ($1)
     RETURNING id`,
    [word]
  );

  return insertedWord.rows[0].id;
};

export const POST = withAuth(
  async (request) => {
    try {
      const rawBody = await request.json();
      const body = rawBody.body ?? rawBody;
      const title = body.title;
      const description = String(body.description || "").trim();
      const fields = body.fields;
      const created_by = request.user?.id;

      if (!created_by) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return Response.json({ error: "No fields provided" }, { status: 400 });
      }

      const exerciseCategory = "dnd";

      // 1. Insert into exercises
      const exRes = await DB.pool(
        `INSERT INTO exercises (created_by, updated_by, category)
       VALUES ($1, $1, $2)
       RETURNING id`,
        [created_by, exerciseCategory]
      );
      const exercise_id = exRes.rows[0].id;

      // 2. Insert into dnd_exercises
      const dndRes = await DB.pool(
        `INSERT INTO dnd_exercises (created_by, exercise_id, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
        [created_by, exercise_id, title, description || null]
      );
      const dnd_id = dndRes.rows[0].id;
      // Process fields
      for (const field of fields) {
        // Insert category
        const category_id = await findOrCreateCategory(
          field.category,
          field.color
        );

        // Insert words (comma-separated input).
        const words = [
          ...new Set(
            field.content
              .split(",")
              .map((word) => word.trim())
              .filter(Boolean)
          ),
        ];
        for (const word of words) {
          const word_id = await findOrCreateWord(word);

          // Insert mapping
          await DB.pool(
            `INSERT INTO word_category_mappings (word_id, category_id, exercise_id)
          VALUES ($1, $2, $3)`,
            [word_id, category_id, dnd_id]
          );
        }
      }

      return Response.json({
        success: true,
        exerciseId: exercise_id,
        dndId: dnd_id,
      });
    } catch (err) {
      console.error("Error creating dragdrop exercise:", err);
      return Response.json(
        { error: "Fehler beim Erstellen der Übung." },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
