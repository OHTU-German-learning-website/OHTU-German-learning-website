"use server";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET(request, params) {
  const { form_id } = await params;
  const user_id = 42;

  const formRows = await DB.pool(
    `
WITH questions AS
         (SELECT pq.id, pq.title, pq.form_part_id
          FROM part_questions pq
                  LEFT JOIN user_question_answers uqa ON pq.id = uqa.part_question_id AND uqa.user_id = $1
                  ),
     parts as
         (SELECT fp.id,
                 fp.title,
                 fp.form_id,
                 jsonb_agg(
                         to_jsonb(
                                 pq.*
                         )
                 ) as questions
          FROM form_parts fp
                   JOIN questions pq
                        ON fp.id = pq.form_part_id
          GROUP BY fp.id),
     forms as
         (SELECT f.id,
                 f.title,
                 f.description,
                 f.iso_language_code,
                 jsonb_agg(
                         to_jsonb(
                                 fp.*
                         )
                 ) as parts
          FROM forms f
                   JOIN parts fp ON f.id = fp.form_id
          WHERE f.id = $2
          GROUP BY f.id)
SELECT *
FROM forms;
  `,
    [user_id, form_id]
  );

  if (!formRows.rowCount) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  return NextResponse.json(formRows.rows[0]);
}
