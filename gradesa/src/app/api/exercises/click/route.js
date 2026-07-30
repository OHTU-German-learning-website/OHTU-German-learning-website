import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async () => {
  try {
    const { rows } = await DB.pool(`
      SELECT 
        ce.id AS click_id,
        ce.title,
        ce.category,
        ce.target_words,
        ce.all_words,
        e.created_at
      FROM 
        click_exercises ce
      JOIN 
        click_to_exercises cte ON cte.click_id = ce.id
      JOIN
        exercises e ON e.id = cte.exercise_id
      ORDER BY 
        e.created_at DESC
    `);

    const feedbackRows = await DB.pool(
      `SELECT click_exercise_id, slot_key, word_text, feedback
       FROM click_false_word_feedbacks
       ORDER BY id ASC`
    );

    const feedbackByExerciseId = new Map();
    feedbackRows.rows.forEach((row) => {
      if (!feedbackByExerciseId.has(row.click_exercise_id)) {
        feedbackByExerciseId.set(row.click_exercise_id, []);
      }
      feedbackByExerciseId.get(row.click_exercise_id).push({
        slot_key: row.slot_key,
        word_text: row.word_text,
        feedback: row.feedback,
      });
    });

    return NextResponse.json(
      rows.map((row) => ({
        ...row,
        false_word_feedbacks: feedbackByExerciseId.get(row.click_id) || [],
      }))
    );
  } catch (error) {
    console.error("Error fetching click exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
