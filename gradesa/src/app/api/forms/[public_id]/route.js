"use server";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const { public_id } = await params;
  const user = request.user;
  const user_id = user.id;

  const formRows = await DB.pool(
    `
WITH questions AS
         (SELECT pq.id, pq.title_en, pq.title_de, pq.form_part_id, COALESCE(uqa.answer, 0) as answer
          FROM part_questions pq
                  LEFT JOIN user_question_answers uqa 
                  ON pq.id = uqa.part_question_id AND uqa.user_id = $1
                  ),
     parts as
         (SELECT fp.id,
                 fp.title_en,
                 fp.title_de,
                 fp.form_id,
                 fp.step_label,
                 jsonb_agg(
                         to_jsonb(
                                 pq.*
                         )
                 ) as questions,
                 COALESCE(upa.answer, 0) as average_answer
        FROM form_parts fp
                   JOIN questions pq
                        ON fp.id = pq.form_part_id
        LEFT JOIN user_part_answers upa 
        ON fp.id = upa.form_part_id AND upa.user_id = $1
                        GROUP BY fp.id, upa.id
                        ORDER BY fp.step_label
          ),
     forms as
         (SELECT f.id,
                 f.title_en,
                 f.title_de,
                 f.description_en,
                 f.description_de,
                 f.public_id,
                 jsonb_agg(
                         to_jsonb(
                                 fp.*
                         )
                 ) as parts,
                 COALESCE(ufa.answer, 0) as average_answer
          FROM forms f
                   JOIN parts fp ON f.id = fp.form_id
                   LEFT JOIN user_form_answers ufa ON f.id = ufa.form_id AND ufa.user_id = $1
          WHERE f.public_id = $2
          GROUP BY f.id, ufa.id)
SELECT *
FROM forms;
  `,
    [user_id, public_id]
  );
  if (!formRows.rows.length) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const form = formRows.rows[0];

  // Not json so it's returned as a string...
  form.average_answer = parseFloat(form.average_answer);
  return NextResponse.json(form);
});
