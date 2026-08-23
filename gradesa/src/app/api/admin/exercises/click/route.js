import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

function sanitizeHtml(html) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  return purify.sanitize(String(html || ""), { ADD_ATTR: ["target"] });
}

function normalizeFalseWordFeedbacks(falseWordFeedbacks) {
  if (!Array.isArray(falseWordFeedbacks)) {
    return [];
  }

  return falseWordFeedbacks.map((entry) => ({
    slotKey: String(entry?.slotKey || entry?.slot_key || "").trim(),
    wordText: String(entry?.wordText || entry?.word_text || "").trim(),
    feedback: String(entry?.feedback || "").trim(),
  }));
}

function validateFalseWordFeedbacks(falseWordFeedbacks) {
  if (falseWordFeedbacks.length === 0) {
    return null;
  }

  if (falseWordFeedbacks.length > 1000) {
    return {
      error:
        "Es dürfen maximal 1000 falsche Wörter mit Feedback gespeichert werden.",
      status: 422,
    };
  }

  if (
    falseWordFeedbacks.some(
      (entry) => !entry.slotKey || !entry.wordText || !entry.feedback
    )
  ) {
    return {
      error: "Für jedes markierte falsche Wort ist ein Feedback erforderlich.",
      status: 422,
    };
  }

  return null;
}

export const POST = withAuth(
  async (request) => {
    const json = await request.json();
    const {
      title,
      instructionText,
      targetCategory,
      targetWords,
      allWords,
      sourceHtml,
      falseWordFeedbacks,
    } = json;
    const exerciseInstruction = String(
      instructionText ?? targetCategory ?? ""
    ).trim();
    const sanitizedSourceHtml = sanitizeHtml(sourceHtml || "");
    const normalizedFalseWordFeedbacks =
      normalizeFalseWordFeedbacks(falseWordFeedbacks);

    if (!title || !exerciseInstruction || !targetWords || !allWords) {
      return Response.json(
        { error: "Alle Felder sind erforderlich." },
        { status: 400 }
      );
    }
    if (title.length < 3 || title.length > 50) {
      return Response.json(
        { error: "Der Titel muss zwischen 3 und 50 Zeichen lang sein." },
        { status: 422 }
      );
    }
    if (exerciseInstruction.length < 5 || exerciseInstruction.length > 200) {
      return Response.json(
        {
          error: "Die Anweisung muss zwischen 5 und 200 Zeichen lang sein.",
        },
        { status: 422 }
      );
    }
    if (targetWords.length < 1 || targetWords.length > 1000) {
      return Response.json(
        { error: "Es müssen zwischen 1 und 1000 Zielwörter vorhanden sein." },
        { status: 422 }
      );
    }
    if (allWords.length < 1 || allWords.length > 1000) {
      return Response.json(
        { error: "Es müssen zwischen 1 und 1000 Wörter vorhanden sein." },
        { status: 422 }
      );
    }

    const falseWordValidationError = validateFalseWordFeedbacks(
      normalizedFalseWordFeedbacks
    );
    if (falseWordValidationError) {
      return Response.json(
        { error: falseWordValidationError.error },
        { status: falseWordValidationError.status }
      );
    }

    const existingExercise = await DB.pool(
      `SELECT ce.id
       FROM click_exercises ce
       JOIN click_to_exercises cte ON cte.click_id = ce.id
       WHERE LOWER(TRIM(ce.title)) = LOWER(TRIM($1))
       LIMIT 1`,
      [title]
    );
    if (existingExercise.rows.length > 0) {
      return Response.json(
        { error: "Eine Übung mit diesem Titel existiert bereits." },
        { status: 409 }
      );
    }
    const id = await DB.transaction(async (tx) => {
      const insertResult = await tx.query(
        `INSERT INTO click_exercises (title, category, target_words, all_words, source_html)
         VALUES ($1, $2, $3, $4, $5) returning id`,
        [title, exerciseInstruction, targetWords, allWords, sanitizedSourceHtml]
      );

      const clickExerciseId = insertResult.rows[0].id;

      for (const entry of normalizedFalseWordFeedbacks) {
        await tx.query(
          `INSERT INTO click_false_word_feedbacks
           (click_exercise_id, slot_key, word_text, feedback)
           VALUES ($1, $2, $3, $4)`,
          [clickExerciseId, entry.slotKey, entry.wordText, entry.feedback]
        );
      }

      await tx.query(
        `UPDATE exercises e
         SET created_by = $1,
             updated_by = $1
         FROM click_to_exercises cte
         WHERE cte.exercise_id = e.id
           AND cte.click_id = $2`,
        [request.user?.id ?? null, clickExerciseId]
      );

      return clickExerciseId;
    });

    return Response.json({ id }, { status: 201 });
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);
