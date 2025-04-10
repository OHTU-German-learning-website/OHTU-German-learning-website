import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  try {
    const { exercise_id } = await params;

    const query = `
      SELECT 
        ffe.id,
        ffe.question,
        ffe.exercise_id
      FROM 
        free_form_exercises ffe
      WHERE 
        ffe.id = $1
    `;

    const { rows } = await DB.pool(query, [exercise_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching free form exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
