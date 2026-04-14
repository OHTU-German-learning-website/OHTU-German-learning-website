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
  ('Das Adjektiv', 1),
  ('Das Adverb', 2),
  ('Das Artikelwort', 3),
  ('Das Pronomen', 4),
  ('Das Substantiv', 5),
  ('Das Verb', 6),
  ('Die Präposition', 7),
  ('Die Syntax', 8);

-- Assign grammar_topic_id for existing grammar pages

-- Das Adjektiv
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Adjektiv')
WHERE page_group = 'grammar' AND slug IN (
  'pradikative-adverbiale-adjektive',
  'attributive-adjektive',
  'adjektivdeklination',
  'adjektivkomparation',
  'rektion-der-adjektive',
  'wortbildung-der-adjektive'
);

-- Das Adverb
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Adverb')
WHERE page_group = 'grammar' AND slug IN (
  'hin-und-her',
  'pronominaladverbien',
  'konjunktionaladverbien',
  'unterscheidung-zu-anderen-wortarten'
);

-- Das Artikelwort
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Artikelwort')
WHERE page_group = 'grammar' AND slug IN (
  'artikelwörter',
  'gebrauch-von-bestimmtem-unbestimmtem-und-nullartikel',
  'gebrauch-anderer-artikelwörter'
);

-- Das Pronomen
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Pronomen')
WHERE page_group = 'grammar' AND slug IN (
  'personalpronomen',
  'demonstrativpronomen',
  'possessivpronomen',
  'relativpronomen',
  'pronomen-es'
);

-- Das Substantiv
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Substantiv')
WHERE page_group = 'grammar' AND slug IN (
  'genuszuordnung',
  'pluralbildung-der-substantive',
  'kasusformen-und-ihre-bildung',
  'besondere-namen',
  'homonyme'
);

-- Das Verb
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Verb')
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

-- Die Präposition
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Die Präposition')
WHERE page_group = 'grammar' AND slug IN (
  'nominativ',
  'akkusativ',
  'dativ',
  'genitiv',
  'prapositionen',
  'lokalprapositionen'
);

-- Die Syntax
-- Note: 'konditionalsatze' appears in both Das Verb and Die Syntax in topics.js;
-- it is assigned here to Die Syntax since Konditionalsätze is a syntax phenomenon.
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Die Syntax')
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
