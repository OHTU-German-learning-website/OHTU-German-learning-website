-- Backfill proper titles, slugs and descriptions for the 16 communication pages.
-- Rows are matched by their original numeric slug (set during migration 00026).

UPDATE html_pages
SET title       = 'Über die Vergangenheit sprechen',
    slug        = 'ueber-die-vergangenheit-sprechen',
    description = 'Wie spricht man über Ereignisse, die bereits vergangen sind, z. B. die berufliche Vergangenheit, die Kindheit?'
WHERE page_group = 'communications' AND slug = '1';

UPDATE html_pages
SET title       = 'Anleitungen formulieren',
    slug        = 'anleitungen-formulieren',
    description = 'Wie repariert man etwas? Wie macht man das in der korrekten Reihenfolge?'
WHERE page_group = 'communications' AND slug = '2';

UPDATE html_pages
SET title       = 'Offizielle Mitteilungen (Nachrichten usw.) formulieren',
    slug        = 'offizielle-mitteilungen-formulieren',
    description = 'Wie formuliert man neutral und sachlich? Offizielle Texte für berufliche Situationen.'
WHERE page_group = 'communications' AND slug = '3';

UPDATE html_pages
SET title       = 'Höflich mit anderen Menschen umgehen',
    slug        = 'hoeflich-mit-anderen-menschen-umgehen',
    description = 'Wie stellt man sich selbst und andere Personen vor? Wie empfängt und betreut man Gäste? Wie führt man Small Talk?'
WHERE page_group = 'communications' AND slug = '4';

UPDATE html_pages
SET title       = 'Menschen beschreiben / Ich und meine Familie',
    slug        = 'menschen-beschreiben',
    description = 'Mit wem arbeite ich? Wer gehört zu meiner Familie? Wer sind meine Bekannten?'
WHERE page_group = 'communications' AND slug = '5';

UPDATE html_pages
SET title       = 'Über Hobbys und Freizeit sprechen',
    slug        = 'ueber-hobbys-und-freizeit-sprechen',
    description = 'Was machen wir nach der Arbeit? Wie verbringen wir unsere Freizeit?'
WHERE page_group = 'communications' AND slug = '6';

UPDATE html_pages
SET title       = 'Über Beruf und Arbeitsplatz sprechen',
    slug        = 'ueber-beruf-und-arbeitsplatz-sprechen',
    description = 'Alles über meine Arbeit! Was mache ich den ganzen Tag?'
WHERE page_group = 'communications' AND slug = '7';

UPDATE html_pages
SET title       = 'Firmen und Produkte beschreiben',
    slug        = 'firmen-und-produkte-beschreiben',
    description = 'Alles über meine Firma! Was stellen wir her? Welche Dienstleistungen bieten wir an?'
WHERE page_group = 'communications' AND slug = '8';

UPDATE html_pages
SET title       = 'Werbung machen',
    slug        = 'werbung-machen',
    description = 'Wie präsentiere ich meine Angebote? Wie motiviere ich potentielle Kunden zum Kauf?'
WHERE page_group = 'communications' AND slug = '9';

UPDATE html_pages
SET title       = 'Einkaufen privat und geschäftlich',
    slug        = 'einkaufen-privat-und-geschaeftlich',
    description = 'Einkaufen in einem Geschäft und online.'
WHERE page_group = 'communications' AND slug = '10';

UPDATE html_pages
SET title       = 'Räume beschreiben',
    slug        = 'raeume-beschreiben',
    description = 'Wie sieht es in meiner Umgebung aus? Das ist meine Wohnung, das ist mein Büro, das ist unser Lager.'
WHERE page_group = 'communications' AND slug = '11';

UPDATE html_pages
SET title       = 'Über historische Ereignisse sprechen',
    slug        = 'ueber-historische-ereignisse-sprechen',
    description = 'Was ist in früheren Zeiten passiert? Historische Fakten über die Geschichte der Familie oder der Firma.'
WHERE page_group = 'communications' AND slug = '12';

UPDATE html_pages
SET title       = 'Pläne machen',
    slug        = 'plaene-machen',
    description = 'Was machen wir am Wochenende? Wie geht es mit unserem Unternehmen weiter, was sind die Perspektiven für die nächsten fünf Jahre?'
WHERE page_group = 'communications' AND slug = '13';

UPDATE html_pages
SET title       = 'An Versammlungen und Geschäftstreffen teilnehmen und sie leiten',
    slug        = 'versammlungen-und-geschaeftstreffen',
    description = 'Wie verläuft ein Business-Meeting? Was sagt man als Versammlungsleiter oder als Teilnehmer?'
WHERE page_group = 'communications' AND slug = '14';

UPDATE html_pages
SET title       = 'Jemandem gratulieren',
    slug        = 'jemandem-gratulieren',
    description = 'Ein Geburtstag? Ein Firmenjubiläum? Sagen und schreiben Sie das Richtige!'
WHERE page_group = 'communications' AND slug = '15';

UPDATE html_pages
SET title       = 'Sich beschweren / etw. reklamieren',
    slug        = 'sich-beschweren-etwas-reklamieren',
    description = 'Ist eine Ware nicht in Ordnung? Hat die Spedition zu spät geliefert? Sagen Sie es im richtigen Ton.'
WHERE page_group = 'communications' AND slug = '16';
