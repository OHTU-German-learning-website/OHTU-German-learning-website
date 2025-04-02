import { DB } from "@/backend/db";

export async function POST(request) {
  const json = await request.json();
  const { title, targetCategory, targetWords, allWords } = json;

  if (!title || !targetCategory || !targetWords || !allWords) {
    return Response.json(
      { error: "Alle Felder sind erforderlich." },
      { status: 400 }
    );
  }
  if (title.length < 3 || title.length > 50) {
    return Response.json(
      { error: "Der Titel muss zwischen 3 und 50 Zeichen lang sein." },
      { status: 422 }
    );
  }
  if (targetCategory.length < 3 || targetCategory.length > 30) {
    return Response.json(
      { error: "Die Kategorie muss zwischen 3 und 30 Zeichen lang sein." },
      { status: 422 }
    );
  }
  if (targetWords.length < 1 || targetWords.length > 1000) {
    return Response.json(
      { error: "Es müssen zwischen 1 und 1000 Zielwörter vorhanden sein." },
      { status: 422 }
    );
  }
  if (allWords.length < 1 || allWords.length > 1000) {
    return Response.json(
      { error: "Es müssen zwischen 1 und 1000 Wörter vorhanden sein." },
      { status: 422 }
    );
  }
  const existingExercise = await DB.pool(
    "SELECT * FROM click_exercises WHERE title = $1",
    [title]
  );
  if (existingExercise.rows.length > 0) {
    return Response.json(
      { error: "Eine Übung mit diesem Titel existiert bereits." },
      { status: 409 }
    );
  }
  const id = await DB.pool(
    `INSERT INTO click_exercises (title, category, target_words, all_words)
     VALUES ($1, $2, $3, $4) returning id`,
    [title, targetCategory, targetWords, allWords]
  );
  console.log(id.rows[0].id);
  return Response.json({ id: id.rows[0].id }, { status: 201 });
}
