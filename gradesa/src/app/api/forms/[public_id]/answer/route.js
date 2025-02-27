import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";
import { DB } from "@/backend/db";

export const GET = withAuth(async (request, { params }) => {
  const { public_id } = await params;
  const user = request.user;
  const averages = await DB.pool(
    `
    SELECT AVG(answer)::numeric(10, 2) as part_average, pq.form_part_id
    FROM user_question_answers uqa
    JOIN part_questions pq ON uqa.part_question_id = pq.id
    JOIN form_parts fp ON pq.form_part_id = fp.id
    JOIN forms f ON fp.form_id = f.id
    WHERE uqa.user_id = $1 AND f.public_id = $2
    GROUP BY pq.form_part_id
    `,
    [user.id, public_id]
  );
  return NextResponse.json(
    Object.fromEntries(
      averages.rows.map((row) => [
        row.form_part_id,
        parseFloat(row.part_average),
      ])
    )
  );
});
