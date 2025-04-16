import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function POST(request) {
  try {
    const { exerciseId, userId, userAnswers } = await request.json();

    if (!exerciseId || !userId || !userAnswers) {
      return NextResponse.json({ error: "Puuttuvia tietoja" }, { status: 400 });
    }

    await DB.pool(
      `INSERT INTO fillinthegap_submissions (exercise_id, user_id, user_answers)
       VALUES ($1, $2, $3)
       ON CONFLICT (exercise_id, user_id)
       DO UPDATE SET user_answers = $3, updated_at = now()`,
      [exerciseId, userId, userAnswers]
    );

    return NextResponse.json({
      message: "Vastaukset tallennettu onnistuneesti",
    });
  } catch (error) {
    console.error("Virhe tallennettaessa vastauksia:", error);
    return NextResponse.json({ error: "Tietokantavirhe" }, { status: 500 });
  }
}
