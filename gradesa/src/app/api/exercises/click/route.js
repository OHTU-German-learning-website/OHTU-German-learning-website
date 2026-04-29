import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
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

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching click exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
