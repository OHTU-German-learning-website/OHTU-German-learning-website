export function slugifySectionTitle(title) {
  const slug = String(title || "")
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "heading";
}

export function createSectionBookmarkId(label, reservedIds = []) {
  const baseId = `bookmark-${slugifySectionTitle(label)}`;
  const used = new Set(reservedIds.filter(Boolean).map(String));
  let id = baseId;
  let suffix = 2;

  while (used.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return id;
}

export function getSectionAnchors(headings, reservedIds = []) {
  const reserved = new Set(
    [...reservedIds, ...headings.map((heading) => heading.id)]
      .filter(Boolean)
      .map((id) => String(id).trim())
  );
  const used = new Set();

  return headings.map((heading) => {
    const existingId = String(heading.id || "").trim();
    const baseId = existingId || `section-${slugifySectionTitle(heading.text)}`;
    let id = baseId;
    let suffix = 2;

    while (used.has(id) || (!existingId && reserved.has(id))) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    used.add(id);
    return { ...heading, id };
  });
}
