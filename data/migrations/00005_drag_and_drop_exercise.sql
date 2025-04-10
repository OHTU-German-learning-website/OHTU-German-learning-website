-- Table for all exercises regardless of type
CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by BIGINT NOT NULL REFERENCES users(id)
);

CREATE TRIGGER updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();

-- Table for drag and drop -type exercises
CREATE TABLE dnd_exercises (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by BIGINT NOT NULL REFERENCES users(id),
    exercise_id BIGINT NOT NULL REFERENCES exercises(id),
    title TEXT NOT NULL
);

CREATE TRIGGER updated_at
BEFORE UPDATE ON public.dnd_exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();

-- Table for dustbin categories
CREATE TABLE dnd_categories (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    category TEXT NOT NULL,
    color TEXT NOT NULL
);

CREATE TRIGGER updated_at
BEFORE UPDATE
ON public.dnd_categories
FOR EACH ROW
EXECUTE FUNCTION updated_at();


-- Table holding all the possible words user can drag and drop
CREATE TABLE draggable_words (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    word TEXT NOT NULL
);

CREATE TRIGGER updated_at
BEFORE UPDATE
ON public.draggable_words
FOR EACH ROW
EXECUTE FUNCTION updated_at();


-- Table for mapping words to their correct dustbin categories
CREATE TABLE word_category_mappings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    word_id BIGINT NOT NULL REFERENCES draggable_words(id),
    category_id BIGINT NOT NULL REFERENCES dnd_categories(id),
    exercise_id BIGINT NOT NULL REFERENCES dnd_exercises(id)
);

CREATE TRIGGER updated_at
BEFORE UPDATE ON public.word_category_mappings
FOR EACH ROW
EXECUTE FUNCTION updated_at();

-- Table holding the user's answers
CREATE TABLE dnd_user_answer (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id BIGINT NOT NULL REFERENCES draggable_words(id),
    category_id BIGINT REFERENCES dnd_categories(id),
    is_correct BOOLEAN NOT NULL
);

CREATE TRIGGER updated_at
BEFORE UPDATE ON public.dnd_user_answer
FOR EACH ROW
EXECUTE FUNCTION updated_at();
