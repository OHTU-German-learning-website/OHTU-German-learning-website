import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { DB } from "@/backend/db";
import { NextResponse } from "next/server";
import { glossaryEntrySchema } from "@/shared/schemas/glossary.schemas";

export const POST = withAuth(
  withInputValidation(glossaryEntrySchema, async (req) => {
    const body = await req.json();
    const { word, word_definition } = body;

    const entryId = await DB.transaction(async (tx) => {
      const result = await tx.query(
        `
        INSERT INTO glossary_entries (word, word_definition)
        VALUES ($1, $2)
        RETURNING id
        `,
        [word, word_definition]
      );
      return result.rows[0].id;
    });

    return NextResponse.json({ success: true, entry_id: entryId });
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const GET = withAuth(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const result = await DB.pool(
        `SELECT id, word, word_definition, created_at, updated_at
         FROM glossary_entries
         WHERE id = $1`,
        [id]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: "Glossary entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    }

    const entries = await DB.pool(
      `SELECT id, word, word_definition, created_at, updated_at 
       FROM glossary_entries 
       ORDER BY created_at DESC`
    );

    return NextResponse.json(entries.rows);
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const PATCH = withAuth(
  withInputValidation(glossaryEntrySchema, async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Glossary entry ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { word, word_definition } = body;

    try {
      const result = await DB.pool(
        `UPDATE glossary_entries
         SET word = $1,
             word_definition = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING id, word, word_definition, created_at, updated_at`,
        [word, word_definition, id]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: "Glossary entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating glossary entry:", error);
      return NextResponse.json(
        { error: "Failed to update glossary entry" },
        { status: 500 }
      );
    }
  }),
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const DELETE = withAuth(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Glossary entry ID is required" },
        { status: 400 }
      );
    }

    try {
      await DB.pool(`DELETE FROM glossary_entries WHERE id = $1`, [id]);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting glossary entry:", error);
      return NextResponse.json(
        { error: "Failed to delete glossary entry" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
