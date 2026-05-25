import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const POST = withAuth(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const answers = Array.isArray(body?.answers) ? body.answers : [];

  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid exercise ID." },
      { status: 400 }
    );
  }

  if (answers.length === 0) {
    return NextResponse.json(
      { error: "Answers are required." },
      { status: 422 }
    );
  }

  try {
    const { rows: contentRows } = await DB.pool(
      `SELECT id, content_type, correct_answer
       FROM multichoice_content
       WHERE multichoice_exercise_id = $1
       ORDER BY content_order`,
      [id]
    );

    if (contentRows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found." },
        { status: 404 }
      );
    }

    const answerMap = new Map(
      answers
        .filter((entry) => entry && entry.contentId != null)
        .map((entry) => [String(entry.contentId), String(entry.answer || "")])
    );

    const results = contentRows
      .filter(
        (item) =>
          item.content_type === "multichoice" || item.content_type === "gap"
      )
      .map((item) => {
        const submitted = (answerMap.get(String(item.id)) || "").trim();
        const expected = String(item.correct_answer || "").trim();
        const isCorrect =
          submitted.length > 0 &&
          submitted.toLowerCase() === expected.toLowerCase();

        return {
          contentId: item.id,
          isCorrect,
          answered: submitted.length > 0,
        };
      });

    const hasMissing = results.some((entry) => !entry.answered);
    const allCorrect =
      results.length > 0 && results.every((entry) => entry.isCorrect);

    return NextResponse.json({
      results,
      hasMissing,
      allCorrect,
    });
  } catch (error) {
    console.error("Error validating multichoice answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
