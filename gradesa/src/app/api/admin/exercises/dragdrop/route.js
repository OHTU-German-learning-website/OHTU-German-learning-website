import { DB } from "@/backend/db";

export async function POST(request) {
  try {
    const { fields } = await request.json();

    if (!fields || !Array.isArray(fields)) {
      return Response.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await DB.pool(`
      WITH new_exercise AS (
        INSERT INTO exercises DEFAULT VALUES
        RETURNING id
      ),
      new_dnd AS (
        INSERT INTO dnd_exercises (exercise_id, title)
        SELECT id, 'Artikel Übung'
        FROM new_exercise
        RETURNING id
      )
      SELECT id FROM new_dnd;
    `);

    const dndId = result.rows[0].id;

    // Insert categories and words
    for (const field of fields) {
      // Insert category
      const categoryResult = await DB.pool(
        `INSERT INTO dnd_categories (category, color)
         VALUES ($1, $2)
         ON CONFLICT (category) DO UPDATE
         SET color = EXCLUDED.color
         RETURNING id`,
        [field.category, field.color]
      );

      const categoryId = categoryResult.rows[0].id;

      // Split words and insert them
      const words = field.content.split(",").map((w) => w.trim());

      for (const word of words) {
        const wordResult = await DB.pool(
          `INSERT INTO draggable_words (word)
           VALUES ($1)
           ON CONFLICT (word) DO UPDATE
           SET word = EXCLUDED.word
           RETURNING id`,
          [word]
        );

        const wordId = wordResult.rows[0].id;

        // Create mapping
        await DB.pool(
          `INSERT INTO word_category_mappings 
           (word_id, category_id, exercise_id)
           VALUES ($1, $2, $3)`,
          [wordId, categoryId, dndId]
        );
      }
    }

    return Response.json({ success: true, id: dndId });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return Response.json(
      { success: false, error: "Fehler beim Erstellen der Übung." },
      { status: 500 }
    );
  }
}
