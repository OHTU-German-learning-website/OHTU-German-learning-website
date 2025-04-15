import { NextResponse } from "next/server";
import { sql } from "@/backend/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId puuttuu" }, { status: 400 });
  }

  try {
    const exercisesResult = await sql`
      SELECT id AS exercise_id, correct_answers
      FROM fillinthegap_exercises
      ORDER BY id
    `;

    const submissionsResult = await sql`
      SELECT exercise_id, user_answers
      FROM fillinthegap_submissions
      WHERE user_id = ${userId}
    `;

    const submissionMap = new Map();
    submissionsResult.rows.forEach((submission) => {
      submissionMap.set(submission.exercise_id, submission.user_answers);
    });

    const statusArray = exercisesResult.rows.map(
      ({ exercise_id, correct_answers }) => {
        const userAnswers = submissionMap.get(exercise_id) || [];
        const done =
          userAnswers.length === correct_answers.length &&
          userAnswers.every((ans, i) => ans === correct_answers[i]);
        return { exercise_id, done };
      }
    );

    return NextResponse.json(statusArray);
  } catch (error) {
    console.error("Virhe haettaessa suoritustilaa:", error);
    return NextResponse.json({ error: "Tietokantavirhe" }, { status: 500 });
  }
}
