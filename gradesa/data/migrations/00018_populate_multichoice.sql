-- Insert example data for multichoice exercises
DO $$
DECLARE
  new_exercise_id bigint;
  new_multichoice_exercise_id bigint;
BEGIN
  INSERT INTO exercises (category) VALUES ('multichoice')
  RETURNING id INTO new_exercise_id;

  INSERT INTO multichoice_exercises (exercise_id, title, exercise_description)
  VALUES
    (new_exercise_id, 'Wortartikel Übung 1', 'Wählen Sie die richtigen Optionen.')
  RETURNING id INTO new_multichoice_exercise_id;

  INSERT INTO multichoice_content (multichoice_exercise_id, content_type, content_value, content_order, correct_answer)
  VALUES
    (new_multichoice_exercise_id, 'text', 'Wenn man in', 1, NULL),
    (new_multichoice_exercise_id, 'multichoice', '___', 2, 'das'),
    (new_multichoice_exercise_id, 'text', 'Land Sachsen kommt, dann kommt man entweder mit', 3, NULL),
    (new_multichoice_exercise_id, 'multichoice', '___', 4, 'der'),
    (new_multichoice_exercise_id, 'text', 'Bahn, mit', 5, NULL),
    (new_multichoice_exercise_id, 'multichoice', '___', 6, 'dem'),
    (new_multichoice_exercise_id, 'text', 'Auto oder mit', 7, NULL),
    (new_multichoice_exercise_id, 'multichoice', '___', 8, 'dem'),
    (new_multichoice_exercise_id, 'text', 'Flugzeug.', 9, NULL);

  WITH content_ids AS (
    SELECT id, content_order
    FROM multichoice_content
    WHERE multichoice_exercise_id = new_multichoice_exercise_id
  )
  INSERT INTO multichoice_options (multichoice_content_id, option_value)
  VALUES
    ((SELECT id FROM content_ids WHERE content_order = 2), 'das'),
    ((SELECT id FROM content_ids WHERE content_order = 2), 'die'),
    ((SELECT id FROM content_ids WHERE content_order = 2), 'der'),
    ((SELECT id FROM content_ids WHERE content_order = 4), 'der'),
    ((SELECT id FROM content_ids WHERE content_order = 4), 'die'),
    ((SELECT id FROM content_ids WHERE content_order = 4), 'das'),
    ((SELECT id FROM content_ids WHERE content_order = 6), 'dem'),
    ((SELECT id FROM content_ids WHERE content_order = 6), 'den'),
    ((SELECT id FROM content_ids WHERE content_order = 6), 'die'),
    ((SELECT id FROM content_ids WHERE content_order = 8), 'dem'),
    ((SELECT id FROM content_ids WHERE content_order = 8), 'den'),
    ((SELECT id FROM content_ids WHERE content_order = 8), 'die');
END
$$;
