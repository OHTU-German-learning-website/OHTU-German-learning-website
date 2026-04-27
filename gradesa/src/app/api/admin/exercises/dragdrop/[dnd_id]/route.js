import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";

const parseWords = (content) =>
    [...new Set(
        String(content || "")
            .split(",")
            .map((word) => word.trim())
            .filter(Boolean)
    )];

const validateFields = ({ title, fields }) => {
    if (!title || !Array.isArray(fields) || fields.length === 0) {
        return { error: "Titel und Felder sind erforderlich.", status: 400 };
    }

    if (title.trim().length < 3 || title.trim().length > 150) {
        return {
            error: "Der Titel muss zwischen 3 und 150 Zeichen lang sein.",
            status: 422,
        };
    }

    for (const field of fields) {
        if (!field?.category || !field?.color || parseWords(field?.content).length === 0) {
            return {
                error: "Jedes Feld braucht Kategorie, Farbe und mindestens ein Wort.",
                status: 422,
            };
        }
    }

    return null;
};

const upsertCategory = async (tx, category, color) => {
    const catRes = await tx.query(
        `INSERT INTO dnd_categories (category, color)
     VALUES ($1, $2)
     ON CONFLICT (category, color) DO NOTHING
     RETURNING id`,
        [category, color]
    );

    if (catRes.rows[0]?.id) return catRes.rows[0].id;

    const existing = await tx.query(
        `SELECT id FROM dnd_categories WHERE category = $1 AND color = $2`,
        [category, color]
    );
    return existing.rows[0].id;
};

const upsertWord = async (tx, word) => {
    const wordRes = await tx.query(
        `INSERT INTO draggable_words (word)
     VALUES ($1)
     ON CONFLICT (word) DO UPDATE SET word = EXCLUDED.word
     RETURNING id`,
        [word]
    );
    return wordRes.rows[0].id;
};

export const GET = withAuth(
    async (request, { params }) => {
        try {
            const { dnd_id } = await params;

            const exerciseRes = await DB.pool(
                `SELECT id, title
         FROM dnd_exercises
         WHERE id = $1`,
                [dnd_id]
            );

            if (exerciseRes.rows.length === 0) {
                return NextResponse.json({ error: "Übung nicht gefunden." }, { status: 404 });
            }

            const fieldsRes = await DB.pool(
                `SELECT
           dc.id AS category_id,
           dc.category,
           dc.color,
           ARRAY_AGG(DISTINCT dw.word ORDER BY dw.word) AS words
         FROM word_category_mappings wcm
         JOIN dnd_categories dc ON dc.id = wcm.category_id
         JOIN draggable_words dw ON dw.id = wcm.word_id
         WHERE wcm.exercise_id = $1
         GROUP BY dc.id, dc.category, dc.color
         ORDER BY dc.id`,
                [dnd_id]
            );

            const fields = fieldsRes.rows.map((row) => ({
                category: row.category,
                color: row.color,
                content: (row.words || []).join(", "),
            }));

            return NextResponse.json({
                id: exerciseRes.rows[0].id,
                title: exerciseRes.rows[0].title,
                fields,
            });
        } catch (error) {
            console.error("Error fetching dragdrop exercise:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    },
    {
        requireAdmin: true,
        requireAuth: true,
    }
);

export const PUT = withAuth(
    async (request, { params }) => {
        try {
            const { dnd_id } = await params;
            const body = await request.json();
            const payload = body.body ?? body;
            const title = payload.title?.trim();
            const fields = payload.fields;

            const validationError = validateFields({ title, fields });
            if (validationError) {
                return NextResponse.json(
                    { error: validationError.error },
                    { status: validationError.status }
                );
            }

            await DB.transaction(async (tx) => {
                const existing = await tx.query(
                    `SELECT id
           FROM dnd_exercises
           WHERE id = $1`,
                    [dnd_id]
                );

                if (existing.rows.length === 0) {
                    throw new Error("DND_EXERCISE_NOT_FOUND");
                }

                await tx.query(
                    `UPDATE dnd_exercises
           SET title = $1,
               updated_at = NOW()
           WHERE id = $2`,
                    [title, dnd_id]
                );

                await tx.query(
                    `DELETE FROM word_category_mappings
           WHERE exercise_id = $1`,
                    [dnd_id]
                );

                for (const field of fields) {
                    const category = field.category.trim();
                    const color = field.color.trim();
                    const words = parseWords(field.content);
                    const categoryId = await upsertCategory(tx, category, color);

                    for (const word of words) {
                        const wordId = await upsertWord(tx, word);
                        await tx.query(
                            `INSERT INTO word_category_mappings (word_id, category_id, exercise_id)
               VALUES ($1, $2, $3)`,
                            [wordId, categoryId, dnd_id]
                        );
                    }
                }
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            if (error.message === "DND_EXERCISE_NOT_FOUND") {
                return NextResponse.json({ error: "Übung nicht gefunden." }, { status: 404 });
            }

            console.error("Error updating dragdrop exercise:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    },
    {
        requireAdmin: true,
        requireAuth: true,
    }
);

export const DELETE = withAuth(
    async (request, { params }) => {
        try {
            const { dnd_id } = await params;

            await DB.transaction(async (tx) => {
                const dndRes = await tx.query(
                    `SELECT exercise_id
           FROM dnd_exercises
           WHERE id = $1`,
                    [dnd_id]
                );

                if (dndRes.rows.length === 0) {
                    throw new Error("DND_EXERCISE_NOT_FOUND");
                }

                const exerciseId = dndRes.rows[0].exercise_id;

                await tx.query(
                    `DELETE FROM dnd_exercises
           WHERE id = $1`,
                    [dnd_id]
                );

                await tx.query(
                    `DELETE FROM exercises
           WHERE id = $1`,
                    [exerciseId]
                );
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            if (error.message === "DND_EXERCISE_NOT_FOUND") {
                return NextResponse.json({ error: "Übung nicht gefunden." }, { status: 404 });
            }

            console.error("Error deleting dragdrop exercise:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    },
    {
        requireAdmin: true,
        requireAuth: true,
    }
);
