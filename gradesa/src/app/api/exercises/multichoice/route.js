import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

export async function GET() {
  try {
    // Fetch multichoice exercises
    const { rows: exercises } = await DB.pool(`
      SELECT 
        me.id AS multichoice_exercise_id,
        e.id AS exercise_id,
        me.title,
        me.exercise_description,
        e.created_at
      FROM 
        multichoice_exercises me
      JOIN 
        exercises e ON me.exercise_id = e.id
      ORDER BY 
        e.created_at DESC
    `);

    // Fetch multichoice content for the exercises
    const exerciseIds = exercises.map(
      (exercise) => exercise.multichoice_exercise_id
    );
    const { rows: content } = await DB.pool(
      `
      SELECT 
        mc.id AS content_id,
        mc.multichoice_exercise_id,
        mc.content_type,
        mc.content_value,
        mc.content_order,
        mc.correct_answer
      FROM 
        multichoice_content mc
      WHERE 
        mc.multichoice_exercise_id = ANY($1::bigint[])
      ORDER BY 
        mc.content_order
      `,
      [exerciseIds]
    );

    // Fetch multichoice options for the content
    const contentIds = content.map((item) => item.content_id);
    const { rows: options } = await DB.pool(
      `
      SELECT 
        mo.id AS option_id,
        mo.multichoice_content_id,
        mo.option_value
      FROM 
        multichoice_options mo
      WHERE 
        mo.multichoice_content_id = ANY($1::bigint[])
      `,
      [contentIds]
    );

    // Combine content and options
    const contentWithOptions = content.map((item) => ({
      ...item,
      options: options.filter(
        (option) => option.multichoice_content_id === item.content_id
      ),
    }));

    // Combine exercises and content
    const exercisesWithContent = exercises.map((exercise) => ({
      ...exercise,
      content: contentWithOptions.filter(
        (item) =>
          item.multichoice_exercise_id === exercise.multichoice_exercise_id
      ),
    }));

    return NextResponse.json(exercisesWithContent);
  } catch (error) {
    console.error("Error fetching multichoice exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
