import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get("exerciseId");
    console.log("Bewerbung mit Ausweis:", exerciseId);

    const query = exerciseId
      ? `SELECT id AS exercise_id, sentence_template, correct_answers
         FROM fillinthegap_exercises
         WHERE id = $1`
      : `SELECT id AS exercise_id, sentence_template, correct_answers
         FROM fillinthegap_exercises
         ORDER BY id
         LIMIT 1`;

    const params = exerciseId ? [exerciseId] : [];
    const result = await DB.pool(query, params);

    console.log("Abfrageergebnis:", result.rows);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Aufgabe nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgabe:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { sentence_template, correct_answers } = await request.json();

    if (!sentence_template || !correct_answers) {
      return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 });
    }

    await DB.pool(
      `INSERT INTO fillinthegap_exercises (sentence_template, correct_answers)
       VALUES ($1, $2)`,
      [sentence_template, correct_answers]
    );

    return NextResponse.json({ message: "Aufgabe erfolgreich gespeichert" });
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
