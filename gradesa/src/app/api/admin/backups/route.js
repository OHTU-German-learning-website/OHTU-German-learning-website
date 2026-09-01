import { withAuth } from "@/backend/middleware/withAuth";
import { NextResponse } from "next/server";
import { listBackups, getBackupPayload } from "@/backend/backups";
import { DB } from "@/backend/db";

async function handler(request) {
  if (request.method === "GET") {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      if (id) {
        const payload = await getBackupPayload(id);
        if (!payload)
          return NextResponse.json(
            { error: "backup not found" },
            { status: 404 }
          );
        return NextResponse.json(payload);
      }
      const entityType = searchParams.get("entity_type");
      const entityId = searchParams.get("entity_id");
      const limit = parseInt(searchParams.get("limit") || "100", 10);

      const rows = await listBackups({ entityType, entityId, limit });
      return NextResponse.json(rows);
    } catch (err) {
      console.error("Error listing backups:", err);
      return NextResponse.json(
        { error: "Failed to list backups", detail: String(err) },
        { status: 500 }
      );
    }
  }

  if (request.method === "POST") {
    // Restore a backup by id
    try {
      const { id } = await request.json();
      if (!id)
        return NextResponse.json({ error: "id required" }, { status: 400 });
      const payload = await getBackupPayload(id);
      if (!payload)
        return NextResponse.json(
          { error: "backup not found" },
          { status: 404 }
        );

      // Basic restore for known entity types: news_articles, glossary_entries
      if (payload.__entity_type === "news_articles") {
        // if entity id exists and row exists, update; else insert
        if (payload.id) {
          const res = await DB.pool(
            `UPDATE news_articles SET title=$1, content=$2, is_teacher_only=$3, updated_at=now() WHERE id=$4 RETURNING id`,
            [
              payload.title,
              payload.content,
              payload.is_teacher_only || false,
              payload.id,
            ]
          );
          if (res.rows.length > 0)
            return NextResponse.json({ restored: res.rows[0].id });
        }
        const ins = await DB.pool(
          `INSERT INTO news_articles (title, content, is_teacher_only) VALUES ($1,$2,$3) RETURNING id`,
          [payload.title, payload.content, payload.is_teacher_only || false]
        );
        return NextResponse.json({ restored: ins.rows[0].id });
      }

      if (payload.__entity_type === "glossary_entries") {
        if (payload.id) {
          const res = await DB.pool(
            `UPDATE glossary SET word=$1, word_definition=$2, updated_at=now() WHERE id=$3 RETURNING id`,
            [payload.word, payload.word_definition, payload.id]
          );
          if (res.rows.length > 0)
            return NextResponse.json({ restored: res.rows[0].id });
        }
        const ins = await DB.pool(
          `INSERT INTO glossary (word, word_definition) VALUES ($1,$2) RETURNING id`,
          [payload.word, payload.word_definition]
        );
        return NextResponse.json({ restored: ins.rows[0].id });
      }

      return NextResponse.json(
        { error: "Unsupported entity type" },
        { status: 400 }
      );
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "restore failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withAuth(handler, { requireAuth: true, requireAdmin: true });
export const POST = withAuth(handler, {
  requireAuth: true,
  requireAdmin: true,
});
