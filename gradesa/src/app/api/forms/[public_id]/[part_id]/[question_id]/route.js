import { DB } from "@/backend/db";
import { logger } from "@/backend/logging";
import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";

export const PUT = withAuth(
  async (request, { params }) => {
    const { public_id, part_id, question_id } = await params;

    const session_id = request.headers.get("x-session-id");
    const user_id = request.user?.id;
    const answerer_id = user_id ?? session_id;

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

    const { answer } = await request.json();
    logger.info(`Submitting answer: ${user_id}, ${question_id}, ${answer}`);
    await DB.transaction(async (tx) => {
      const updated = await tx.query(
        `
UPDATE user_question_answers
SET answer = $3,
    user_id = COALESCE($4, user_id),
    updated_at = NOW()
WHERE answerer_id = $1 AND part_question_id = $2
RETURNING id
`,
        [answerer_id, question_id, answer, user_id]
      );

      if (updated.rows.length === 0) {
        await tx.query(
          `
INSERT INTO user_question_answers (user_id, part_question_id, answer, answerer_id)
VALUES ($1, $2, $3, $4)
`,
          [user_id, question_id, answer, answerer_id]
        );
        return;
      }

      if (updated.rows.length > 1) {
        await tx.query(
          `
DELETE FROM user_question_answers
WHERE answerer_id = $1
  AND part_question_id = $2
  AND id <> (
    SELECT MAX(id)
    FROM user_question_answers
    WHERE answerer_id = $1 AND part_question_id = $2
  )
`,
          [answerer_id, question_id]
        );
      }
    });

    return NextResponse.json({ success: true });
  },
  {
    requireAuth: false,
  }
);
