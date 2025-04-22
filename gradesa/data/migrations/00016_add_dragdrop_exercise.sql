-- First create a test user if it doesn't exist
WITH test_user AS (
  INSERT INTO users (email, password_hash, is_admin, salt) 
  VALUES ('test@example.com', '$2b$10$xXNxLQv0VZyNnDhLxQ7pZOkLrD4nLxZOU.NPz6BCYGgIJYYUHYXOW', true, '')
  ON CONFLICT DO NOTHING
  RETURNING id
),

-- Create a new exercise
new_exercise AS (
  INSERT INTO exercises (created_by, category)
  SELECT id, 'dnd' FROM test_user
  RETURNING id
),

-- Create the drag and drop exercise
new_dnd AS (
  INSERT INTO dnd_exercises (created_by, exercise_id, title)
  SELECT 
    u.id,
    e.id,
    'Artikel: Der, Die, Das'
  FROM new_exercise e
  CROSS JOIN test_user u
  RETURNING id
)
-- Insert categories
INSERT INTO dnd_categories (category, color) 
VALUES 
  ('DER', 'blue1'),
  ('DIE', 'red'),
  ('DAS', 'green')
ON CONFLICT DO NOTHING;

-- Insert words
INSERT INTO draggable_words (word) 
VALUES 
  ('Hund'),      -- der
  ('Computer'),  -- der
  ('Tisch'),     -- der
  ('Stift'),     -- der
  ('Tag'),       -- der
  ('Katze'),     -- die
  ('Tür'),       -- die
  ('Tasche'),    -- die
  ('Schule'),    -- die
  ('Zeit'),      -- die
  ('Haus'),      -- das
  ('Buch'),      -- das
  ('Auto'),      -- das
  ('Kind'),      -- das
  ('Fenster')    -- das
ON CONFLICT DO NOTHING;

-- Map words to categories for this exercise
INSERT INTO word_category_mappings (word_id, category_id, exercise_id)
VALUES
('1', '1', '1'),  -- Haus -> DER
('2', '1', '1'),  -- Computer -> DER
('3', '1', '1'),  -- Tisch -> DER
('4', '1', '1'),  -- Stift -> DER
('5', '1', '1'),  -- Tag -> DER
('6', '2', '1'),  -- Katze -> DIE
('7', '2', '1'),  -- Tür -> DIE
('8', '2', '1'),  -- Tasche -> DIE
('9', '2', '1'),  -- Schule -> DIE
('10', '2', '1'), -- Zeit -> DIE
('11', '3', '1'), -- Haus -> DAS
('12', '3', '1'), -- Buch -> DAS
('13', '3', '1'), -- Auto -> DAS
('14', '3', '1'), -- Kind -> DAS
('15', '3', '1')  -- Fenster -> DAS
ON CONFLICT DO NOTHING;