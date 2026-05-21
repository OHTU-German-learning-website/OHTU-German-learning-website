import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const { rows } = await DB.pool(
      `SELECT jse.id, jse.title, e.created_at
       FROM jumbled_sentence_exercises jse
       JOIN exercises e ON e.id = jse.exercise_id
       ORDER BY e.created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
