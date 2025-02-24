import { DB } from "@/backend/db";
import { logger } from "@/backend/logging";
import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";

export const PUT = withAuth(async (request, { params }) => {
  const { public_id, part_id, question_id } = await params;
  const user = request.user;
  const valid_form = await DB.pool(
    `SELECT f.id FROM forms f
      JOIN form_parts fp ON f.id = fp.form_id
      JOIN part_questions pq ON fp.id = pq.form_part_id
      WHERE f.public_id = $1 AND fp.id = $2 AND pq.id = $3`,
    [public_id, part_id, question_id]
  );

  if (valid_form.rows.length === 0) {
    logger.error(`Form not found: ${public_id}, ${part_id}, ${question_id}`);
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const form_id = valid_form.rows[0].id;

  const { answer } = await request.json();
  const user_id = user.id;
  logger.info(`Submitting answer: ${user_id}, ${question_id}, ${answer}`);
  await DB.transaction(async (tx) => {
    await tx.query(
      `
INSERT INTO user_question_answers (user_id, part_question_id, answer)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, part_question_id) DO UPDATE
SET answer = $3
RETURNING *
`,
      [user_id, question_id, answer]
    );

    await tx.query(
      `WITH uqa_avg AS (
  SELECT AVG(uqa.answer) AS answer
  FROM user_question_answers uqa
  JOIN part_questions pq ON uqa.part_question_id = pq.id
  WHERE pq.form_part_id = $2 AND uqa.user_id = $1
)
INSERT INTO user_part_answers (user_id, form_part_id, answer)
SELECT $1, $2, COALESCE(uqa_avg.answer, 0)
FROM uqa_avg
ON CONFLICT (user_id, form_part_id) DO UPDATE
SET answer = COALESCE(EXCLUDED.answer, 0)
`,
      [user_id, part_id]
    );

    await tx.query(
      `
WITH ufa_avg AS (
  SELECT AVG(upa.answer) AS answer
  FROM user_part_answers upa
  JOIN form_parts fp ON upa.form_part_id = fp.id
  WHERE fp.form_id = $2 AND upa.user_id = $1
)
INSERT INTO user_form_answers (user_id, form_id, answer)
SELECT $1, $2, COALESCE(ufa_avg.answer, 0)
FROM ufa_avg
ON CONFLICT (user_id, form_id) DO UPDATE
SET answer = COALESCE(EXCLUDED.answer, 0)
`,
      [user_id, form_id]
    );
  });

  return NextResponse.json({ success: true });
});
