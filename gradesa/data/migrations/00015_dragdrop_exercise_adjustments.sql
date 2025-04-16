BEGIN;

-- Modify existing exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS created_by BIGINT REFERENCES users(id);

-- Drop existing relationships that will be replaced
ALTER TABLE words_to_exercises DROP CONSTRAINT IF EXISTS words_to_exercises_word_id_fkey;
ALTER TABLE words_to_exercises DROP CONSTRAINT IF EXISTS words_to_exercises_exercise_id_fkey;
DROP TABLE IF EXISTS words_to_exercises;

-- Drop existing user_answers constraints before modifying
ALTER TABLE user_answers DROP CONSTRAINT IF EXISTS user_answers_draggable_words_id_fkey;
DROP TABLE IF EXISTS user_answers;

-- Modify draggable_words table
ALTER TABLE draggable_words 
DROP COLUMN IF EXISTS correct_answer CASCADE;

-- Create new dnd_exercises table
CREATE TABLE IF NOT EXISTS dnd_exercises (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by BIGINT NOT NULL REFERENCES users(id),
    exercise_id BIGINT NOT NULL REFERENCES exercises(id),
    title TEXT NOT NULL
);

-- Create new categories table
CREATE TABLE IF NOT EXISTS dnd_categories (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    category TEXT NOT NULL,
    color TEXT NOT NULL
);

-- Create new word_category_mappings table
CREATE TABLE IF NOT EXISTS word_category_mappings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    word_id BIGINT NOT NULL REFERENCES draggable_words(id),
    category_id BIGINT NOT NULL REFERENCES dnd_categories(id),
    exercise_id BIGINT NOT NULL REFERENCES dnd_exercises(id)
);

-- Create new user answers table with updated structure
CREATE TABLE IF NOT EXISTS dnd_user_answer (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id BIGINT NOT NULL REFERENCES draggable_words(id),
    category_id BIGINT REFERENCES dnd_categories(id),
    is_correct BOOLEAN NOT NULL
);

-- Create triggers for new tables
CREATE TRIGGER updated_at
BEFORE UPDATE ON dnd_exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TRIGGER updated_at
BEFORE UPDATE ON dnd_categories
FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TRIGGER updated_at
BEFORE UPDATE ON word_category_mappings
FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TRIGGER updated_at
BEFORE UPDATE ON dnd_user_answer
FOR EACH ROW
EXECUTE FUNCTION updated_at();

COMMIT;