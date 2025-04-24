import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";
import { logger } from "@/backend/logging";

const linkSchema = z.object({
  anchor_id: z.string().min(1, "Anchor ID is required"),
  exercise_id: z
    .number()
    .int()
    .positive("Exercise ID must be a positive integer"),
  position: z.number().int().optional().default(0),
});

async function handler(request) {
  try {
    const { anchor_id, exercise_id, position } = await request.json();

    const exerciseResult = await DB.pool(
      "SELECT id FROM exercises WHERE id = $1",
      [exercise_id]
    );

    if (exerciseResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    let anchorResult = await DB.pool(
      "SELECT id FROM anchors WHERE anchor_id = $1",
      [anchor_id]
    );

    let anchorId;
    if (anchorResult.rows.length === 0) {
      const newAnchorResult = await DB.pool(
        "INSERT INTO anchors (anchor_id) VALUES ($1) RETURNING id",
        [anchor_id]
      );
      anchorId = newAnchorResult.rows[0].id;
    } else {
      anchorId = anchorResult.rows[0].id;
    }

    const linkResult = await DB.pool(
      "SELECT id FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exercise_id, anchorId]
    );

    if (linkResult.rows.length > 0) {
      await DB.pool(
        "UPDATE exercise_anchors SET position = $1 WHERE exercise_id = $2 AND anchor_id = $3",
        [position, exercise_id, anchorId]
      );
    } else {
      await DB.pool(
        "INSERT INTO exercise_anchors (exercise_id, anchor_id, position) VALUES ($1, $2, $3)",
        [exercise_id, anchorId, position]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error linking exercise to anchor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withInputValidation(
  linkSchema,
  withAuth(handler, { requireAuth: true, requireAdmin: true })
);
