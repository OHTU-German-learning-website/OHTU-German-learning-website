-- Add impressum page for system pages
INSERT INTO html_pages (page_group, slug, title, description, content, page_order)
VALUES (
  'system',
  'impressum',
  'Impressum',
  'Rechtliche Informationen und Impressum',
  '<p>Diese Webseiten entstanden in einem Autorenkollektiv der Universitäten Helsinki, Oulu und Turku unter der Leitung von <a href="mailto:michi@dlc.fi">Dr. Michael Möbius</a>.</p><br><p>Die Entwicklung wurde gefördert durch die <a href="https://foundationhollo.fi/" target="_blank" rel="noreferrer">Stiftung Erkki J. Hollo</a>.</p><p>Programmierung durch IT-Studierende der Universität Helsinki</p><p>Technischer Support und Hosting: Universität Helsinki</p>',
  1
);