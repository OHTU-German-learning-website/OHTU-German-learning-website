import { DB } from "./db";
import zlib from "zlib";
import crypto from "crypto";

export async function saveBackup(
  entityType,
  entityId,
  payloadObject,
  actorId = null
) {
  const body = Object.assign({}, payloadObject || {});
  // embed metadata so restores know the original entity
  body.__entity_type = entityType;
  if (entityId !== undefined && entityId !== null) body.id = entityId;
  const json = JSON.stringify(body);
  const compressed = zlib.gzipSync(Buffer.from(json, "utf8"));
  const checksum = crypto.createHash("md5").update(compressed).digest("hex");

  try {
    await DB.pool(
      `INSERT INTO backups (entity_type, entity_id, actor_id, checksum, payload)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (entity_type, entity_id, checksum) DO NOTHING`,
      [
        entityType,
        entityId ? String(entityId) : null,
        actorId,
        checksum,
        compressed,
      ]
    );
  } catch (err) {
    console.error("Failed to save backup:", err);
  }
}

export async function listBackups({
  entityType = null,
  entityId = null,
  limit = 100,
} = {}) {
  const parts = [];
  const params = [];
  let idx = 1;
  if (entityType) {
    parts.push(`entity_type = $${idx++}`);
    params.push(entityType);
  }
  if (entityId) {
    parts.push(`entity_id = $${idx++}`);
    params.push(String(entityId));
  }

  const where = parts.length ? `WHERE ${parts.join(" AND ")}` : "";
  const q = `SELECT id, entity_type, entity_id, actor_id, checksum, created_at FROM backups ${where} ORDER BY created_at DESC LIMIT $${idx}`;
  params.push(limit);
  const res = await DB.pool(q, params);
  // Attach a small preview extracted from the payload so the UI can display
  // a human-friendly label without decompressing the full payload client-side.
  const rows = res.rows;
  const previews = await Promise.all(
    rows.map(async (r) => {
      try {
        const payload = await getBackupPayload(r.id);
        let preview = "";
        if (payload) {
          if (payload.title) preview = String(payload.title);
          else if (payload.word) preview = String(payload.word);
          else if (payload.word_definition)
            preview = String(payload.word_definition);
          else if (payload.content) {
            // strip HTML tags for a short preview
            const asText = String(payload.content).replace(/<[^>]*>/g, "");
            preview = asText;
          } else {
            preview = JSON.stringify(payload);
          }
        }

        if (preview && preview.length > 80)
          preview = preview.slice(0, 77) + "...";
        return { ...r, preview };
      } catch (err) {
        return { ...r, preview: "" };
      }
    })
  );

  return previews;
}

export async function getBackupPayload(id) {
  const res = await DB.pool(`SELECT payload FROM backups WHERE id = $1`, [id]);
  if (res.rows.length === 0) return null;
  const buf = res.rows[0].payload;
  try {
    const json = zlib.gunzipSync(buf).toString("utf8");
    return JSON.parse(json);
  } catch (err) {
    console.error("Failed to decompress backup payload:", err);
    return null;
  }
}
