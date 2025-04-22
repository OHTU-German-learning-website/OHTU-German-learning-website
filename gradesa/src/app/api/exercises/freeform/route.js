import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows } = await DB.pool(`
      SELECT 
        ffe.id,
        ffe.question,
        ffe.exercise_id,
        e.created_at
      FROM 
        free_form_exercises ffe
      JOIN 
        exercises e ON ffe.exercise_id = e.id
      ORDER BY 
        e.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching free form exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
