CREATE INDEX IF NOT EXISTS html_pages_search_fts_idx
  ON html_pages
  USING GIN (
    to_tsvector(
      'simple',
      COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')
    )
  );

CREATE INDEX IF NOT EXISTS free_form_exercises_search_fts_idx
  ON free_form_exercises
  USING GIN (
    to_tsvector('simple', COALESCE(title, ''))
  );

CREATE INDEX IF NOT EXISTS free_form_questions_search_fts_idx
  ON free_form_questions
  USING GIN (
    to_tsvector('simple', COALESCE(question, ''))
  );

CREATE INDEX IF NOT EXISTS multichoice_exercises_search_fts_idx
  ON multichoice_exercises
  USING GIN (
    to_tsvector(
      'simple',
      COALESCE(title, '') || ' ' || COALESCE(exercise_description, '')
    )
  );

CREATE INDEX IF NOT EXISTS multichoice_content_search_fts_idx
  ON multichoice_content
  USING GIN (
    to_tsvector('simple', COALESCE(content_value, '') || ' ' || COALESCE(correct_answer, ''))
  );

CREATE INDEX IF NOT EXISTS click_exercises_search_fts_idx
  ON click_exercises
  USING GIN (
    to_tsvector(
      'simple',
      COALESCE(title, '') || ' ' || COALESCE(category, '') || ' ' ||
      COALESCE(target_words::text, '') || ' ' || COALESCE(all_words::text, '')
    )
  );

CREATE INDEX IF NOT EXISTS fill_gap_exercises_search_fts_idx
  ON fill_gap_exercises
  USING GIN (
    to_tsvector(
      'simple',
      COALESCE(title, '') || ' ' || COALESCE(source_text, '') || ' ' || COALESCE(source_html, '')
    )
  );

CREATE INDEX IF NOT EXISTS fill_gap_gaps_search_fts_idx
  ON fill_gap_gaps
  USING GIN (
    to_tsvector('simple', COALESCE(token_text, ''))
  );

CREATE INDEX IF NOT EXISTS dnd_exercises_search_fts_idx
  ON dnd_exercises
  USING GIN (
    to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  );

CREATE INDEX IF NOT EXISTS dnd_match_exercises_search_fts_idx
  ON dnd_match_exercises
  USING GIN (
    to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  );

CREATE INDEX IF NOT EXISTS dnd_match_pairs_search_fts_idx
  ON dnd_match_pairs
  USING GIN (
    to_tsvector('simple', COALESCE(left_item, '') || ' ' || COALESCE(right_item, ''))
  );

CREATE INDEX IF NOT EXISTS memory_game_exercises_search_fts_idx
  ON memory_game_exercises
  USING GIN (
    to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  );

CREATE INDEX IF NOT EXISTS memory_game_pairs_search_fts_idx
  ON memory_game_pairs
  USING GIN (
    to_tsvector('simple', COALESCE(left_item, '') || ' ' || COALESCE(right_item, ''))
  );

CREATE INDEX IF NOT EXISTS jumbled_sentence_exercises_search_fts_idx
  ON jumbled_sentence_exercises
  USING GIN (
    to_tsvector('simple', COALESCE(title, ''))
  );

CREATE INDEX IF NOT EXISTS jumbled_sentence_sentences_search_fts_idx
  ON jumbled_sentence_sentences
  USING GIN (
    to_tsvector('simple', COALESCE(sentence, ''))
  );
