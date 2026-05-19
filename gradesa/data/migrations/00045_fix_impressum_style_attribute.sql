-- Remove empty style attribute that caused React errors on the Impressum page
UPDATE html_pages 
SET content = REPLACE(content, 'style=""', '') 
WHERE page_group = 'system' AND slug = 'impressum';
