-- Creating the table for words and correct answers
CREATE TABLE correct_answers (
    correct_answers_id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    word text NOT NULL,
    answer text
);

-- Creating the exercise table
CREATE TABLE exercise (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    title text UNIQUE NOT NULL,
    correct_answers bigint,
    FOREIGN KEY (correct_answers_id) REFERENCES correct_answers(correct_answers_id)
);

-- Creating the table that joins the correct answer table and exercise table
CREATE TABLE words_to_exercises (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    word_id bigint,
    exercise_id bigint,
    FOREIGN KEY (word_id) REFERENCES correct_answers(correct_answers_id),
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
);