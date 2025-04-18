-- Table holding exercises that are type "click"
CREATE TABLE click_exercises(
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    target_words TEXT [] NOT NULL,
    all_words TEXT [] NOT NULL,
    UNIQUE (all_words, target_words),
    UNIQUE (id, target_words)
);

CREATE TRIGGER updated_at
BEFORE UPDATE
ON public.click_exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();

-- Table holding user answers for click-type exercises
CREATE TABLE click_answers (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    click_exercise_id BIGINT NOT NULL REFERENCES click_exercises(id) ON DELETE CASCADE,
    answer TEXT [] NOT NULL,
    target_words TEXT [] NOT NULL,
    is_correct BOOLEAN NOT NULL GENERATED ALWAYS AS (answer = target_words) STORED,
    FOREIGN KEY (click_exercise_id, target_words) REFERENCES click_exercises(id, target_words) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TRIGGER updated_at
BEFORE UPDATE
ON public.click_answers
FOR EACH ROW
EXECUTE FUNCTION updated_at();

-- Table connecting click-type exercises to the main exercise table
CREATE TABLE click_to_exercises (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    click_id bigint,
    exercise_id bigint,
    FOREIGN KEY (click_id) REFERENCES click_exercises(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TRIGGER updated_at
BEFORE UPDATE
ON public.click_to_exercises
FOR EACH ROW
EXECUTE FUNCTION updated_at();