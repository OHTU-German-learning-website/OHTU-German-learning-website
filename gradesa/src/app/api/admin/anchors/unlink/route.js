import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";
import { logger } from "@/backend/logging";

const unlinkSchema = z.object({
  anchorId: z.string().min(1, "Anchor ID is required"),
  exerciseId: z
    .number()
    .int()
    .positive("Exercise ID must be a positive integer"),
});

async function handler(request) {
  try {
    const { anchorId, exerciseId } = await request.json();

    const anchorResult = await DB.pool(
      "SELECT id FROM anchors WHERE anchor_id = $1",
      [anchorId]
    );

    if (anchorResult.rows.length === 0) {
      return NextResponse.json({ error: "Anchor not found" }, { status: 404 });
    }

    const anchor = anchorResult.rows[0];

    // Remove the link between the exercise and the anchor
    const deleteResult = await DB.pool(
      "DELETE FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exerciseId, anchor.id]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { error: "Link not found or already removed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error unlinking exercise from anchor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withInputValidation(
  unlinkSchema,
  withAuth(handler, { requireAuth: true, requireAdmin: true })
);
