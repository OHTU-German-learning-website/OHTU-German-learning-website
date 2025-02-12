INSERT INTO forms(title, iso_language_code) VALUES 
('Learning form', 'en'),
('Learnung form', 'de')

WITH created_forms AS(
  select id from forms WHERE iso_language_code = 'en'
)
INSERT INTO form_parts() VALUES 

INSERT INTO form_part_questions() VALUES
()