-- Add difficulty and title fields to exercise_anchors table
ALTER TABLE exercise_anchors
ADD COLUMN difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL DEFAULT 'medium',
ADD COLUMN title TEXT;