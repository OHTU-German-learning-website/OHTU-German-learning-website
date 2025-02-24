CREATE TABLE IF NOT EXISTS user_part_answers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    form_part_id INT NOT NULL REFERENCES form_parts(id) ON DELETE CASCADE,
    answer NUMERIC(5, 1) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS user_part_answers_user_id_form_part_id_idx
  ON user_part_answers (user_id, form_part_id);

CREATE TRIGGER updated_at
    BEFORE UPDATE
    ON public.user_part_answers
    FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TABLE IF NOT EXISTS user_form_answers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    form_id INT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    answer NUMERIC(5, 1) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS user_form_answers_user_id_form_id_idx
  ON user_form_answers (user_id, form_id);

CREATE TRIGGER updated_at
    BEFORE UPDATE
    ON public.user_form_answers
    FOR EACH ROW
EXECUTE FUNCTION updated_at();