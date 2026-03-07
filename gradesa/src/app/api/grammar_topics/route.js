import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    const grammarTopics = await getGrammarTopicsJSON();
    return NextResponse.json(grammarTopics);
  } catch (error) {
    console.error("Error fetching grammar topics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getGrammarTopicsJSON() {
  const result = await DB.pool(
    `
      SELECT * FROM grammar_topics;
    `
  );

  return result.rows[0].grammar_topics;
}
