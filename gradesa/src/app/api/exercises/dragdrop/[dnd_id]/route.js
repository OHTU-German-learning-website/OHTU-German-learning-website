import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { dnd_id } = params;

  if (!dnd_id || isNaN(parseInt(dnd_id, 10))) {
    return Response.json({ message: "Ungültige Übungs-ID." }, { status: 400 });
  }

  try {
    // Fetch exercise details
    const exercise = await DB.pool(
      `
      SELECT dnd.id, dnd.title, dnd.created_at
      FROM dnd_exercises dnd
      WHERE dnd.id = $1
    `,
      [dnd_id]
    );

    if (exercise.rows.length === 0) {
      return Response.json(
        { message: "Keine Übung gefunden." },
        { status: 404 }
      );
    }

    // Fetch categories (dustbins)
    const categories = await DB.pool(
      `
      SELECT DISTINCT dc.id, dc.category, dc.color
      FROM dnd_categories dc
      JOIN word_category_mappings wcm ON dc.id = wcm.category_id
      WHERE wcm.exercise_id = $1
    `,
      [dnd_id]
    );

    // Fetch words with their correct categories
    const words = await DB.pool(
      `
      SELECT 
        dw.id,
        dw.word as name,
        dc.category as type
      FROM draggable_words dw
      JOIN word_category_mappings wcm ON dw.id = wcm.word_id
      JOIN dnd_categories dc ON wcm.category_id = dc.id
      WHERE wcm.exercise_id = $1
    `,
      [dnd_id]
    );

    return Response.json({
      exercise: exercise.rows[0],
      title: exercise.rows[0].title,
      categories: categories.rows,
      words: words.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { message: "Datenbankfehler beim Abrufen der Übung." },
      { status: 500 }
    );
  }
}
