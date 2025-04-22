BEGIN;

ALTER TABLE dnd_categories
ADD CONSTRAINT unique_category_color UNIQUE (category, color);

ALTER TABLE draggable_words ADD CONSTRAINT unique_word UNIQUE (word);

COMMIT;