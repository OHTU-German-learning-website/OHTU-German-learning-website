import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

export const GET = withAuth(
  async (request, { params }) => {
    const { id } = await params;

    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Ungültige Übungs-ID." },
        { status: 400 }
      );
    }

    const { rows: exerciseRows } = await DB.pool(
      `SELECT id, title, description
       FROM memory_game_exercises
       WHERE id = $1`,
      [id]
    );

    if (exerciseRows.length === 0) {
      return NextResponse.json(
        { error: "Übung nicht gefunden." },
        { status: 404 }
      );
    }

    const { rows: pairs } = await DB.pool(
      `SELECT id, left_item, right_item, pair_order
       FROM memory_game_pairs
       WHERE memory_game_exercise_id = $1
       ORDER BY pair_order ASC`,
      [id]
    );

    return NextResponse.json({ ...exerciseRows[0], pairs });
  },
  { requireAuth: true, requireAdmin: true }
);

export const PUT = withAuth(
  async (request, { params }) => {
    const { id } = await params;
    const body = await request.json();
    const { title, description, pairs } = body;

    if (
      !id ||
      Number.isNaN(Number(id)) ||
      !title ||
      !description ||
      !Array.isArray(pairs) ||
      pairs.length === 0
    ) {
      return NextResponse.json(
        { error: "Ungültige Eingabe." },
        { status: 400 }
      );
    }

    const trimmedPairs = pairs.map((pair) => ({
      left_item: String(pair.left_item || "").trim(),
      right_item: String(pair.right_item || "").trim(),
    }));

    if (trimmedPairs.some((pair) => !pair.left_item || !pair.right_item)) {
      return NextResponse.json(
        { error: "Alle Paare müssen ausgefüllt sein." },
        { status: 422 }
      );
    }

    try {
      await DB.transaction(async (tx) => {
        const { rows } = await tx.query(
          `SELECT exercise_id FROM memory_game_exercises WHERE id = $1`,
          [id]
        );

        if (rows.length === 0) {
          throw new Error("NOT_FOUND");
        }

        await tx.query(
          `UPDATE memory_game_exercises
           SET title = $1, description = $2, updated_at = NOW()
           WHERE id = $3`,
          [title, description, id]
        );

        await tx.query(
          `DELETE FROM memory_game_pairs WHERE memory_game_exercise_id = $1`,
          [id]
        );

        for (let i = 0; i < trimmedPairs.length; i += 1) {
          const pair = trimmedPairs[i];
          await tx.query(
            `INSERT INTO memory_game_pairs
             (memory_game_exercise_id, left_item, right_item, pair_order)
             VALUES ($1, $2, $3, $4)`,
            [id, pair.left_item, pair.right_item, i + 1]
          );
        }
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }
      console.error("Error updating memory game exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requireAuth: true, requireAdmin: true }
);

export const DELETE = withAuth(
  async (request, { params }) => {
    const { id } = await params;

    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Ungültige Übungs-ID." },
        { status: 400 }
      );
    }

    try {
      const { rows } = await DB.pool(
        `SELECT exercise_id FROM memory_game_exercises WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      await DB.pool(`DELETE FROM exercises WHERE id = $1`, [
        rows[0].exercise_id,
      ]);
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting memory game exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requireAuth: true, requireAdmin: true }
);
