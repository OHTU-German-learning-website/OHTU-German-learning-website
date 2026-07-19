import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { canDeleteOwnedContent } from "@/backend/content-permissions";
import { withAuth } from "@/backend/middleware/withAuth";
import { dndMatchCreateSchema } from "@/shared/schemas/dnd-match.schemas";

export const GET = withAuth(
  async (request, { params }) => {
    try {
      const { match_id } = await params;

      const { rows: exerciseRows } = await DB.pool(
        `SELECT
           dme.id,
           dme.title,
           dme.description,
           e.updated_at AS last_modified_at,
           COALESCE(NULLIF(u.username, ''), u.email) AS last_modified_by
         FROM dnd_match_exercises dme
         JOIN exercises e ON e.id = dme.exercise_id
         LEFT JOIN users u ON u.id = COALESCE(e.updated_by, e.created_by)
         WHERE dme.id = $1`,
        [match_id]
      );

      if (exerciseRows.length === 0) {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      const { rows: pairs } = await DB.pool(
        `SELECT id, left_item, right_item, pair_order
         FROM dnd_match_pairs
         WHERE dnd_match_exercise_id = $1
         ORDER BY pair_order ASC`,
        [match_id]
      );

      return NextResponse.json({ ...exerciseRows[0], pairs });
    } catch (error) {
      console.error("Error fetching dnd_match exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true, requireAuth: true }
);

export const PUT = withAuth(
  async (request, { params }) => {
    try {
      const { match_id } = await params;
      const body = await request.json();
      const parsed = dndMatchCreateSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: parsed.error.issues[0]?.message || "Ungültige Eingabe.",
            issues: parsed.error.issues,
          },
          { status: 422 }
        );
      }

      const { title, description, pairs } = parsed.data;

      await DB.transaction(async (tx) => {
        const { rows } = await tx.query(
          `SELECT id FROM dnd_match_exercises WHERE id = $1`,
          [match_id]
        );
        if (rows.length === 0) throw new Error("NOT_FOUND");

        await tx.query(
          `UPDATE dnd_match_exercises
           SET title = $1, description = $2, updated_at = NOW()
           WHERE id = $3`,
          [title, description, match_id]
        );

        await tx.query(
          `UPDATE exercises
           SET updated_by = $1
           WHERE id = (
             SELECT exercise_id
             FROM dnd_match_exercises
             WHERE id = $2
           )`,
          [request.user?.id ?? null, match_id]
        );

        await tx.query(
          `DELETE FROM dnd_match_pairs WHERE dnd_match_exercise_id = $1`,
          [match_id]
        );

        for (let i = 0; i < pairs.length; i++) {
          await tx.query(
            `INSERT INTO dnd_match_pairs
               (dnd_match_exercise_id, left_item, right_item, pair_order)
             VALUES ($1, $2, $3, $4)`,
            [match_id, pairs[i].leftItem, pairs[i].rightItem, i + 1]
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
      console.error("Error updating dnd_match exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true, requireAuth: true }
);

export const DELETE = withAuth(
  async (request, { params }) => {
    try {
      const { match_id } = await params;

      const { rows } = await DB.pool(
        `SELECT dme.exercise_id, e.created_by
         FROM dnd_match_exercises dme
         JOIN exercises e ON e.id = dme.exercise_id
         WHERE dme.id = $1`,
        [match_id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Übung nicht gefunden." },
          { status: 404 }
        );
      }

      if (!canDeleteOwnedContent(request.user, rows[0].created_by)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Deleting from exercises cascades to dnd_match_exercises → pairs → user_answers
      await DB.pool(`DELETE FROM exercises WHERE id = $1`, [
        rows[0].exercise_id,
      ]);

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting dnd_match exercise:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true, requireAuth: true }
);
