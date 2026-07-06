import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

const MAX_RESULTS = 12;

function toPlainText(value) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSnippet(searchableText, query) {
  const text = toPlainText(searchableText);

  if (!text) return "";

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index < 0) {
    return text.length > 140 ? `${text.slice(0, 140)}...` : text;
  }

  const start = Math.max(0, index - 55);
  const end = Math.min(text.length, index + query.length + 85);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  return `${prefix}${text.slice(start, end)}${suffix}`;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").trim();

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const likeQuery = `%${query}%`;

    const { rows } = await DB.pool(
      `
      WITH candidates AS (
        SELECT
          'page' AS item_kind,
          'static' AS item_group,
          p.title AS title,
          p.url AS url,
          p.searchable_text AS searchable_text
        FROM (
          VALUES
            ('Startseite', '/', 'Startseite home gradesa deutsch lernen'),
            ('Übungstypen', '/grammar/exercises', 'Übungen exercise types Übersicht'),
            ('Freie-Übungen', '/grammar/exercises/freeform', 'Freie-Übungen offene Fragen freeform'),
            ('Klick-Übungen', '/grammar/exercises/click', 'Klick-Übungen target words'),
            ('Multiple-Choice-Übungen', '/grammar/exercises/multichoice', 'Multiple Choice Übungen'),
            ('Sortieren/Gruppieren-Übungen', '/grammar/exercises/dragdrop', 'drag drop Übungen sortieren gruppieren'),
            ('Lückentext-Übungen', '/grammar/exercises/fillinthegap', 'fill in the gap Lückentext Übungen'),
            ('Zuordnungs-Übungen', '/grammar/exercises/dnd-match', 'Zuordnung dnd match Übungen'),
            ('Memory Game', '/grammar/exercises/memory-game', 'Memory Game Übungen'),
            ('Satzmix-Übungen', '/grammar/exercises/jumbled-sentence', 'Satzmix jumbled sentence Übungen'),
            ('Themen der Grammatik', '/grammar/themes', 'Grammatik Themen Übersicht'),
            ('Glossar', '/glossary', 'Glossar Wörterbuch Worterklärungen'),
            ('Neuigkeiten', '/news', 'News Neuigkeiten Artikel'),
            ('Brauchen Sie Hilfe?', '/contact', 'Kontakt Hilfe support'),
            ('Effektiv online lernen', '/pages/resources', 'resources lernen chapters'),
            ('Kommunikationssituationen', '/pages/communications', 'communications Kommunikation Seiten')
        ) AS p(title, url, searchable_text)

        UNION ALL

        SELECT
          'page' AS item_kind,
          hp.page_group AS item_group,
          hp.title AS title,
          CONCAT('/pages/', hp.page_group, '/', hp.slug) AS url,
          COALESCE(hp.description, '') || ' ' || COALESCE(hp.content, '') AS searchable_text
        FROM html_pages hp
        WHERE hp.page_group IN ('resources', 'communications', 'grammar')

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'freeform' AS item_group,
          ffe.title AS title,
          CONCAT('/grammar/exercises/freeform/', ffe.id) AS url,
          COALESCE(ffe.title, '') || ' ' || COALESCE(questions.questions_text, '') AS searchable_text
        FROM free_form_exercises ffe
        LEFT JOIN (
          SELECT free_form_exercise_id, STRING_AGG(question, ' ') AS questions_text
          FROM free_form_questions
          GROUP BY free_form_exercise_id
        ) questions ON questions.free_form_exercise_id = ffe.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'multichoice' AS item_group,
          me.title AS title,
          CONCAT('/grammar/exercises/multichoice/', me.id) AS url,
          COALESCE(me.title, '') || ' ' || COALESCE(me.exercise_description, '') || ' ' ||
          COALESCE(content.content_text, '') || ' ' || COALESCE(options.options_text, '') AS searchable_text
        FROM multichoice_exercises me
        LEFT JOIN (
          SELECT multichoice_exercise_id, STRING_AGG(content_value, ' ') AS content_text
          FROM multichoice_content
          GROUP BY multichoice_exercise_id
        ) content ON content.multichoice_exercise_id = me.id
        LEFT JOIN (
          SELECT mc.multichoice_exercise_id, STRING_AGG(mo.option_value, ' ') AS options_text
          FROM multichoice_content mc
          JOIN multichoice_options mo ON mo.multichoice_content_id = mc.id
          GROUP BY mc.multichoice_exercise_id
        ) options ON options.multichoice_exercise_id = me.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'click' AS item_group,
          ce.title AS title,
          CONCAT('/grammar/exercises/click/', ce.id) AS url,
          COALESCE(ce.title, '') || ' ' || COALESCE(ce.category, '') || ' ' ||
          COALESCE(ce.target_words::text, '') || ' ' || COALESCE(ce.all_words::text, '') AS searchable_text
        FROM click_exercises ce

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'fillinthegap' AS item_group,
          fge.title AS title,
          CONCAT('/grammar/exercises/fillinthegap/', fge.id) AS url,
          COALESCE(fge.title, '') || ' ' || COALESCE(fge.source_text, '') || ' ' ||
          COALESCE(gaps.gap_text, '') AS searchable_text
        FROM fill_gap_exercises fge
        LEFT JOIN (
          SELECT fill_gap_exercise_id, STRING_AGG(token_text, ' ') AS gap_text
          FROM fill_gap_gaps
          GROUP BY fill_gap_exercise_id
        ) gaps ON gaps.fill_gap_exercise_id = fge.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'dragdrop' AS item_group,
          dnd.title AS title,
          CONCAT('/grammar/exercises/dragdrop/', dnd.id) AS url,
          COALESCE(dnd.title, '') || ' ' || COALESCE(dnd.description, '') || ' ' ||
          COALESCE(words.word_text, '') || ' ' || COALESCE(categories.category_text, '') AS searchable_text
        FROM dnd_exercises dnd
        LEFT JOIN (
          SELECT wcm.exercise_id, STRING_AGG(dw.word, ' ') AS word_text
          FROM word_category_mappings wcm
          JOIN draggable_words dw ON dw.id = wcm.word_id
          GROUP BY wcm.exercise_id
        ) words ON words.exercise_id = dnd.id
        LEFT JOIN (
          SELECT wcm.exercise_id, STRING_AGG(dc.category, ' ') AS category_text
          FROM word_category_mappings wcm
          JOIN dnd_categories dc ON dc.id = wcm.category_id
          GROUP BY wcm.exercise_id
        ) categories ON categories.exercise_id = dnd.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'dnd-match' AS item_group,
          dme.title AS title,
          CONCAT('/grammar/exercises/dnd-match/', dme.id) AS url,
          COALESCE(dme.title, '') || ' ' || COALESCE(dme.description, '') || ' ' ||
          COALESCE(pairs.pair_text, '') AS searchable_text
        FROM dnd_match_exercises dme
        LEFT JOIN (
          SELECT dnd_match_exercise_id, STRING_AGG(left_item || ' ' || right_item, ' ') AS pair_text
          FROM dnd_match_pairs
          GROUP BY dnd_match_exercise_id
        ) pairs ON pairs.dnd_match_exercise_id = dme.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'memory-game' AS item_group,
          me.title AS title,
          CONCAT('/grammar/exercises/memory-game/', me.id) AS url,
          COALESCE(me.title, '') || ' ' || COALESCE(me.description, '') || ' ' ||
          COALESCE(pairs.pair_text, '') AS searchable_text
        FROM memory_game_exercises me
        LEFT JOIN (
          SELECT memory_game_exercise_id, STRING_AGG(left_item || ' ' || right_item, ' ') AS pair_text
          FROM memory_game_pairs
          GROUP BY memory_game_exercise_id
        ) pairs ON pairs.memory_game_exercise_id = me.id

        UNION ALL

        SELECT
          'exercise' AS item_kind,
          'jumbled-sentence' AS item_group,
          jse.title AS title,
          CONCAT('/grammar/exercises/jumbled-sentence/', jse.id) AS url,
          COALESCE(jse.title, '') || ' ' || COALESCE(sentences.sentence_text, '') AS searchable_text
        FROM jumbled_sentence_exercises jse
        LEFT JOIN (
          SELECT jumbled_exercise_id, STRING_AGG(sentence, ' ') AS sentence_text
          FROM jumbled_sentence_sentences
          GROUP BY jumbled_exercise_id
        ) sentences ON sentences.jumbled_exercise_id = jse.id
      )
      SELECT
        item_kind,
        item_group,
        title,
        url,
        searchable_text,
        CASE
          WHEN title ILIKE $1 || '%' THEN 0
          WHEN title ILIKE $2 THEN 1
          ELSE 2
        END AS rank_bucket
      FROM candidates
      WHERE title ILIKE $2 OR searchable_text ILIKE $2
      ORDER BY rank_bucket ASC, title ASC
      LIMIT $3
      `,
      [query, likeQuery, MAX_RESULTS]
    );

    return NextResponse.json({
      results: rows.map((row) => ({
        kind: row.item_kind,
        group: row.item_group,
        title: row.title,
        url: row.url,
        snippet: buildSnippet(row.searchable_text, query),
      })),
    });
  } catch (error) {
    console.error("Error searching content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
