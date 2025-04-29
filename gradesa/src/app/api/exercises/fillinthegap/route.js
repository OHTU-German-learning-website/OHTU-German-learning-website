import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get("exerciseId");
    console.log("Haetaan tehtävää ID:llä:", exerciseId);

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

    console.log("Kyselyn tulos:", result.rows);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Tehtävää ei löytynyt" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Virhe haettaessa tehtävää:", error);
    return NextResponse.json({ error: "Tietokantavirhe" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { sentence_template, correct_answers } = await request.json();

    if (!sentence_template || !correct_answers) {
      return NextResponse.json({ error: "Puuttuvia tietoja" }, { status: 400 });
    }

    await DB.pool(
      `INSERT INTO fillinthegap_exercises (sentence_template, correct_answers)
       VALUES ($1, $2)`,
      [sentence_template, correct_answers]
    );

    return NextResponse.json({ message: "Tehtävä tallennettu onnistuneesti" });
  } catch (error) {
    console.error("Virhe tallennettaessa tehtävää:", error);
    return NextResponse.json({ error: "Tietokantavirhe" }, { status: 500 });
  }
}
