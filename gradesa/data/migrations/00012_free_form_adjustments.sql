ALTER TABLE free_form_answer_feedbacks ADD COLUMN answer TEXT NOT NULL;

ALTER TABLE free_form_answers ADD COLUMN is_correct BOOLEAN DEFAULT false;
ALTER TABLE free_form_answers ADD COLUMN feedback TEXT;

DROP TABLE free_form_answer_feedbacks;