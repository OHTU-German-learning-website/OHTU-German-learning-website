import { DB } from "@/backend/db";

export async function POST(request) {
  try {
    const rawBody = await request.json();
    const body = rawBody.body;
    const title = body.title;
    const fields = body.fields;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return Response.json({ error: "No fields provided" }, { status: 400 });
    }

    const created_by = 1;
    const exerciseCategory = "dnd";

    // 1. Insert into exercises
    const exRes = await DB.pool(
      `INSERT INTO exercises (created_by, category)
       VALUES ($1, $2)
       RETURNING id`,
      [created_by, exerciseCategory]
    );
    const exercise_id = exRes.rows[0].id;

    // 2. Insert into dnd_exercises
    const dndRes = await DB.pool(
      `INSERT INTO dnd_exercises (created_by, exercise_id, title)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [created_by, exercise_id, title]
    );
    const dnd_id = dndRes.rows[0].id;
    // Process fields
    for (const field of fields) {
      // Insert category
      const catRes = await DB.pool(
        `INSERT INTO dnd_categories (category, color)
        VALUES ($1, $2)
        ON CONFLICT (category, color) DO NOTHING
        RETURNING id`,
        [field.category, field.color]
      );

      const category_id =
        catRes.rows[0]?.id ||
        (
          await DB.pool(
            `SELECT id FROM dnd_categories WHERE category = $1 AND color = $2`,
            [field.category, field.color]
          )
        ).rows[0].id;

      // Insert words
      const words = field.content.split(",").map((word) => word.trim());
      for (const word of words) {
        const wordRes = await DB.pool(
          `INSERT INTO draggable_words (word)
          VALUES ($1)
          ON CONFLICT (word) DO NOTHING
          RETURNING id`,
          [word]
        );

        const word_id = wordRes.rows[0]?.id;

        // Insert mapping
        await DB.pool(
          `INSERT INTO word_category_mappings (word_id, category_id, exercise_id)
          VALUES ($1, $2, $3)`,
          [word_id, category_id, dnd_id]
        );
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error creating dragdrop exercise:", err);
    return Response.json(
      { error: "Fehler beim Erstellen der Übung." },
      { status: 500 }
    );
  }
}
