-- Create grammar_topics table for categorizing grammar pages
CREATE TABLE IF NOT EXISTS grammar_topics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT
);

-- Add grammar_topic_id column to html_pages (nullable FK)
ALTER TABLE html_pages ADD COLUMN IF NOT EXISTS grammar_topic_id INT REFERENCES grammar_topics(id);

-- Insert the 8 existing topic categories (matching hardcoded topics.js)
INSERT INTO grammar_topics (name, sort_order) VALUES
  ('Adjektiv', 1),
  ('Adverb', 2),
  ('Artikelwort', 3),
  ('Pronomen', 4),
  ('Substantiv', 5),
  ('Verb', 6),
  ('Präposition', 7),
  ('Syntax', 8);

-- Assign grammar_topic_id for existing grammar pages

-- Adjektiv
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Adjektiv')
WHERE page_group = 'grammar' AND slug IN (
  'pradikative-adverbiale-adjektive',
  'attributive-adjektive',
  'adjektivdeklination',
  'adjektivkomparation',
  'rektion-der-adjektive',
  'wortbildung-der-adjektive'
);

-- Adverb
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Adverb')
WHERE page_group = 'grammar' AND slug IN (
  'hin-und-her',
  'pronominaladverbien',
  'konjunktionaladverbien',
  'unterscheidung-zu-anderen-wortarten'
);

-- Artikelwort
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Artikelwort')
WHERE page_group = 'grammar' AND slug IN (
  'artikelwörter',
  'gebrauch-von-bestimmtem-unbestimmtem-und-nullartikel',
  'gebrauch-anderer-artikelwörter'
);

-- Pronomen
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Pronomen')
WHERE page_group = 'grammar' AND slug IN (
  'personalpronomen',
  'demonstrativpronomen',
  'possessivpronomen',
  'relativpronomen',
  'pronomen-es'
);

-- Substantiv
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Substantiv')
WHERE page_group = 'grammar' AND slug IN (
  'genuszuordnung',
  'pluralbildung-der-substantive',
  'kasusformen-und-ihre-bildung',
  'besondere-namen',
  'homonyme'
);

-- Verb
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Verb')
WHERE page_group = 'grammar' AND slug IN (
  'tempora',
  'perfekt',
  'partizip_ii',
  'prasens',
  'prateritum',
  'plusquamperfekt',
  'futur',
  'numerus',
  'konjugation',
  'schwache-verben',
  'starke-und-unregelmasige-verben',
  'hilfsverben',
  'kategorien-des-verbs',
  'formenbildung',
  'zusammengesetzte-verben',
  'modalverben-und-subjektive-modalitat',
  'objektive-modalitat',
  'reflexive-verben',
  'modus',
  'konjunktiv_i',
  'konjunktiv_ii',
  'imperativ',
  'genus-verbi',
  'passiv',
  'passiv-ersatzformen',
  'rektion-der-verben',
  'mit-reinem-kasus',
  'mit-prapositionalkasus',
  'infinitivformen',
  'funktionsverbgefüge'
);

-- Präposition
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Präposition')
WHERE page_group = 'grammar' AND slug IN (
  'nominativ',
  'akkusativ',
  'dativ',
  'genitiv',
  'prapositionen',
  'lokalprapositionen'
);

-- Syntax
-- Note: 'konditionalsatze' appears in both Verb and Syntax in topics.js;
-- it is assigned here to Syntax since Konditionalsätze is a syntax phenomenon.
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Syntax')
WHERE page_group = 'grammar' AND slug IN (
  'konjunktionalsatze',
  'konditionalsatze',
  'kausalsatze',
  'konsekutivsatze',
  'konzessivsatze',
  'lokalsatze',
  'temporalsatze',
  'indirekte-fragesatze',
  'relativsatze',
  'satzklammer',
  'nebensatze',
  'infinitivkonstruktionen',
  'satzperiode'
);
