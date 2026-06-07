import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";

export const GET = withAuth(
  async (request, { params }) => {
    const { public_id } = await params;
    const user = request.user;
    const answerer_id = user?.id ?? request.headers.get("x-session-id");
    const averages = await DB.pool(
      `
    WITH latest_answers AS (
      SELECT DISTINCT ON (part_question_id)
        part_question_id,
        answer
      FROM user_question_answers
      WHERE answerer_id = $1
      ORDER BY part_question_id, updated_at DESC, id DESC
    )
    SELECT AVG(la.answer)::numeric(10, 2) as part_average, pq.form_part_id
    FROM latest_answers la
    JOIN part_questions pq ON la.part_question_id = pq.id
    JOIN form_parts fp ON pq.form_part_id = fp.id
    JOIN forms f ON fp.form_id = f.id
    WHERE f.public_id = $2
    GROUP BY pq.form_part_id
    `,
      [answerer_id, public_id]
    );
    return NextResponse.json(
      Object.fromEntries(
        averages.rows.map((row) => [
          row.form_part_id,
          parseFloat(row.part_average),
        ])
      )
    );
  },
  {
    requireAuth: false,
  }
);
