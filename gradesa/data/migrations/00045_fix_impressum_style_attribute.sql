-- Remove empty style attribute that causes React error on Impressum page
-- The empty style="" was being passed to React which expects style objects, not strings
UPDATE html_pages 
SET content = REPLACE(content, 'style=""', '') 
WHERE page_group = 'system' AND slug = 'impressum';
