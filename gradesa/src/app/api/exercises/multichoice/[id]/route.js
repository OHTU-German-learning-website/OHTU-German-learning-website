import { DB } from "@/backend/db";

export async function GET(request, { params }) {
  const { id } = params; // Extract the id from the URL

  if (!id || isNaN(parseInt(id, 10))) {
    return Response.json({ message: "Invalid exercise ID." }, { status: 400 });
  }

  try {
    // Fetch exercise metadata
    const exerciseResult = await DB.pool(
      "SELECT * FROM multichoice_exercises WHERE id = $1",
      [id]
    );
    const exercise = exerciseResult.rows[0];

    if (!exercise) {
      return Response.json({ message: "Exercise not found." }, { status: 404 });
    }

    // Fetch exercise content
    const contentResult = await DB.pool(
      "SELECT * FROM multichoice_content WHERE multichoice_exercise_id = $1 ORDER BY content_order",
      [id]
    );
    const content = contentResult.rows;

    // Fetch options for each multichoice content
    const optionsResult = await DB.pool(
      "SELECT * FROM multichoice_options WHERE multichoice_content_id = ANY($1::bigint[])",
      [content.map((item) => item.id)]
    );
    const options = optionsResult.rows;

    // Map options to their respective content
    const contentWithOptions = content.map((item) => {
      if (item.content_type === "multichoice") {
        return {
          ...item,
          options: options
            .filter((option) => option.multichoice_content_id === item.id)
            .map((option) => option.option_value),
        };
      }
      return item;
    });

    return Response.json({ ...exercise, content: contentWithOptions });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
