import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";
import { logger } from "@/backend/logging";

const linkSchema = z.object({
  anchorId: z.string().min(1, "Anchor ID is required"),
  exerciseId: z
    .number()
    .int()
    .positive("Exercise ID must be a positive integer"),
  position: z.number().int().default(0).optional(),
});

async function handler(request) {
  try {
    const { anchorId, exerciseId, position } = await request.json();

    const result = await DB.transaction(async (client) => {
      let anchorDbId;
      const existingAnchorResult = await client.query(
        "SELECT id FROM anchors WHERE anchor_id = $1",
        [anchorId]
      );

      if (existingAnchorResult.rows.length > 0) {
        anchorDbId = existingAnchorResult.rows[0].id;
      } else {
        const newAnchorResult = await client.query(
          "INSERT INTO anchors (anchor_id) VALUES ($1) RETURNING id",
          [anchorId]
        );

        if (newAnchorResult.rows.length === 0) {
          throw new Error("Failed to create anchor");
        }

        anchorDbId = newAnchorResult.rows[0].id;
      }

      await client.query(
        `INSERT INTO exercise_anchors (exercise_id, anchor_id, position)
         VALUES ($1, $2, $3)
         ON CONFLICT (exercise_id, anchor_id) 
         DO UPDATE SET position = $3`,
        [exerciseId, anchorDbId, position || 0]
      );

      return { success: true };
    });

    return NextResponse.json(result);
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
