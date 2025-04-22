import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const entries = await DB.pool(
      `SELECT id, word, word_definition, created_at, updated_at 
       FROM glossary_entries 
       ORDER BY word ASC`
    );

    return NextResponse.json(entries.rows);
  } catch (error) {
    console.error("Error fetching glossary entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch glossary entries" },
      { status: 500 }
    );
  }
}
