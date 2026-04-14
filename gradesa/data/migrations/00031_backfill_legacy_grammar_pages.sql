-- One-time backfill: import legacy grammar chapters into html_pages.
-- Safe to run once in production migration flow.

WITH legacy_pages(slug, title) AS (
  VALUES
    ('adjektivdeklination', 'Adjektivdeklination'),
    ('adjektivkomparation', 'Adjektivkomparation'),
    ('akkusativ', 'Akkusativ'),
    ('artikelverwendung', 'Artikelverwendung'),
    ('artikelwörter', 'Artikelwörter'),
    ('dativ', 'Dativ'),
    ('dativ-verben', 'Dativ-Verben'),
    ('funktionsverbgefüge', 'Funktionsverbgefüge'),
    ('futur', 'Futur'),
    ('genitiv', 'Genitiv'),
    ('genuszuordnung', 'Genuszuordnung'),
    ('hilfsverben', 'Hilfsverben (Konjugation Präsens und Präteritum)'),
    ('indirekte-fragesatze', 'Indirekte Fragesätze'),
    ('infinitivkonstruktionen', 'Infinitivkonstruktionen'),
    ('kategorien-des-verbs', 'Kategorien des Verbs'),
    ('kausalsatze', 'Kausalsätze'),
    ('konditionalsatze', 'Konditionalsätze (real/irreal mit Konjunktiv II und würde)'),
    ('konjunktiv_i', 'Konjunktiv I Bildung'),
    ('konjunktiv_ii', 'Konjunktiv II Bildung'),
    ('konjunktionalsatze', 'Konjunktionalsätze'),
    ('konsekutivsatze', 'Konsekutivsätze'),
    ('konzessivsatze', 'Konzessivsätze'),
    ('lokalprapositionen', 'Lokalpräpositionen'),
    ('lokalsatze', 'Lokalsätze'),
    ('modalverben-und-subjektive-modalitat', 'Modalverben und subjektive Modalität'),
    ('nebensatze', 'Nebensätze (mit uneingeleiteten)'),
    ('nominativ', 'Nominativ (mit Kopulaverben)'),
    ('partizip_ii', 'Partizip II'),
    ('passiv', 'Passiv'),
    ('perfekt', 'Perfekt'),
    ('pluralbildung-der-substantive', 'Pluralbildung der Substantive'),
    ('plusquamperfekt', 'Plusquamperfekt'),
    ('prapositionen', 'Präpositionen (Rektion)'),
    ('prasens', 'Präsens'),
    ('prateritum', 'Präteritum'),
    ('pronomen-es', 'Pronomen es'),
    ('pronomina', 'Pronomina'),
    ('reflexive-verben', 'Reflexive Verben'),
    ('rektion-der-verben', 'Rektion der Verben'),
    ('relativsatze', 'Relativsätze'),
    ('satzklammer', 'Satzklammer'),
    ('temporalsatze', 'Temporalsätze (mit Chronologie in Prozessbeschreibungen)'),
    ('vergleiche', 'Vergleiche'),
    ('zusammengesetzte-verben', 'Zusammengesetzte Verben (trennbar/untrennbar)')
)
INSERT INTO html_pages (title, content, page_order, slug, page_group, grammar_topic_id)
SELECT
  lp.title,
  '',
  NULL,
  lp.slug,
  'grammar',
  NULL
FROM legacy_pages lp
WHERE NOT EXISTS (
  SELECT 1
  FROM html_pages hp
  WHERE hp.page_group = 'grammar' AND hp.slug = lp.slug
);

-- If a placeholder grammar row exists (title equals slug/empty), update to human title.
WITH legacy_pages(slug, title) AS (
  VALUES
    ('adjektivdeklination', 'Adjektivdeklination'),
    ('adjektivkomparation', 'Adjektivkomparation'),
    ('akkusativ', 'Akkusativ'),
    ('artikelverwendung', 'Artikelverwendung'),
    ('artikelwörter', 'Artikelwörter'),
    ('dativ', 'Dativ'),
    ('dativ-verben', 'Dativ-Verben'),
    ('funktionsverbgefüge', 'Funktionsverbgefüge'),
    ('futur', 'Futur'),
    ('genitiv', 'Genitiv'),
    ('genuszuordnung', 'Genuszuordnung'),
    ('hilfsverben', 'Hilfsverben (Konjugation Präsens und Präteritum)'),
    ('indirekte-fragesatze', 'Indirekte Fragesätze'),
    ('infinitivkonstruktionen', 'Infinitivkonstruktionen'),
    ('kategorien-des-verbs', 'Kategorien des Verbs'),
    ('kausalsatze', 'Kausalsätze'),
    ('konditionalsatze', 'Konditionalsätze (real/irreal mit Konjunktiv II und würde)'),
    ('konjunktiv_i', 'Konjunktiv I Bildung'),
    ('konjunktiv_ii', 'Konjunktiv II Bildung'),
    ('konjunktionalsatze', 'Konjunktionalsätze'),
    ('konsekutivsatze', 'Konsekutivsätze'),
    ('konzessivsatze', 'Konzessivsätze'),
    ('lokalprapositionen', 'Lokalpräpositionen'),
    ('lokalsatze', 'Lokalsätze'),
    ('modalverben-und-subjektive-modalitat', 'Modalverben und subjektive Modalität'),
    ('nebensatze', 'Nebensätze (mit uneingeleiteten)'),
    ('nominativ', 'Nominativ (mit Kopulaverben)'),
    ('partizip_ii', 'Partizip II'),
    ('passiv', 'Passiv'),
    ('perfekt', 'Perfekt'),
    ('pluralbildung-der-substantive', 'Pluralbildung der Substantive'),
    ('plusquamperfekt', 'Plusquamperfekt'),
    ('prapositionen', 'Präpositionen (Rektion)'),
    ('prasens', 'Präsens'),
    ('prateritum', 'Präteritum'),
    ('pronomen-es', 'Pronomen es'),
    ('pronomina', 'Pronomina'),
    ('reflexive-verben', 'Reflexive Verben'),
    ('rektion-der-verben', 'Rektion der Verben'),
    ('relativsatze', 'Relativsätze'),
    ('satzklammer', 'Satzklammer'),
    ('temporalsatze', 'Temporalsätze (mit Chronologie in Prozessbeschreibungen)'),
    ('vergleiche', 'Vergleiche'),
    ('zusammengesetzte-verben', 'Zusammengesetzte Verben (trennbar/untrennbar)')
)
UPDATE html_pages hp
SET title = lp.title
FROM legacy_pages lp
WHERE hp.page_group = 'grammar'
  AND hp.slug = lp.slug
  AND (hp.title IS NULL OR hp.title = '' OR hp.title = hp.slug);

-- Backfill topic mapping for known legacy slugs when topic is still NULL.
UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Adjektiv' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN ('adjektivdeklination', 'adjektivkomparation');

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Artikelwort' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN ('artikelwörter');

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Verb' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN (
    'futur',
    'hilfsverben',
    'kategorien-des-verbs',
    'konjunktiv_i',
    'konjunktiv_ii',
    'modalverben-und-subjektive-modalitat',
    'partizip_ii',
    'perfekt',
    'plusquamperfekt',
    'prasens',
    'prateritum',
    'reflexive-verben',
    'rektion-der-verben',
    'zusammengesetzte-verben',
    'funktionsverbgefüge'
  );

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Substantiv' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN ('genuszuordnung', 'pluralbildung-der-substantive');

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Das Pronomen' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN ('pronomen-es');

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Die Präposition' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN ('akkusativ', 'dativ', 'genitiv', 'nominativ', 'prapositionen', 'lokalprapositionen');

UPDATE html_pages
SET grammar_topic_id = (SELECT id FROM grammar_topics WHERE name = 'Die Syntax' ORDER BY id LIMIT 1)
WHERE page_group = 'grammar'
  AND grammar_topic_id IS NULL
  AND slug IN (
    'indirekte-fragesatze',
    'infinitivkonstruktionen',
    'kausalsatze',
    'konditionalsatze',
    'konjunktionalsatze',
    'konsekutivsatze',
    'konzessivsatze',
    'lokalsatze',
    'nebensatze',
    'relativsatze',
    'satzklammer',
    'temporalsatze'
  );
