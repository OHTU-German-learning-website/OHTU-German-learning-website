ALTER TABLE exercises ADD COLUMN category TEXT NOT NULL DEFAULT 'freeform';

CREATE OR REPLACE FUNCTION insert_into_exercises()
RETURNS TRIGGER AS $$
DECLARE
    new_exercise_id BIGINT;
BEGIN
    -- Insert a new row into the exercises table
    INSERT INTO exercises (created_at, updated_at, category)
    VALUES (NOW(), NOW(), 'click')
    RETURNING id INTO new_exercise_id;

    -- Link the new exercise to the click_exercises entry
    INSERT INTO click_to_exercises (click_id, exercise_id, created_at, updated_at)
    VALUES (NEW.id, new_exercise_id, NOW(), NOW());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_click_exercises_insert
AFTER INSERT ON click_exercises
FOR EACH ROW
EXECUTE FUNCTION insert_into_exercises();