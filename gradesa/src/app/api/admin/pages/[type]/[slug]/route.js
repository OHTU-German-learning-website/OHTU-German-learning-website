import { getPageData, setPageData } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { canDeleteOwnedContent } from "@/backend/content-permissions";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

// Allowed page_group values stored in the consolidated `html_pages` table.
const VALID_PAGE_GROUPS = new Set(["resources", "communications", "grammar"]);

function normalizePageDescription(description) {
  if (typeof description !== "string") return null;

  const trimmedDescription = description.trim();
  return trimmedDescription ? trimmedDescription : null;
}

/*
  Route behavior (summary):
  - The `type` route param maps to the `page_group` value stored in the
    consolidated `html_pages` table (values: `resources`, `communications`).
  - PUT has two flows:
    * Content-only updates: when the request body includes the `content`
      property (including an explicit empty string) the route sanitizes the
      value and calls `updateHTMLContent(page_group, slug, cleaned)`. A
      failed update returns HTTP 400.
    * Full-page updates: when other fields (title/slug/page_order) are
      provided the handler fetches the page, applies changes and calls
      `setPageData` with slug collision checks.
  - The route requires an authenticated admin (`withAuth(..., { requireAdmin: true })`).
*/

export const PATCH = withAuth(
  async (req, { params }) => {
    try {
      const { type, slug } = await params;

      const query = `UPDATE html_pages SET content = '', updated_by = $3 WHERE slug = $1 AND page_group = $2 RETURNING *`;
      const result = await DB.pool(query, [slug, type, req.user?.id ?? null]);

      if (result.rowCount === 0)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      return NextResponse.json({ message: "Cleared" }, { status: 200 });
    } catch (error) {
      console.error("PATCH page failed", error);
      return NextResponse.json(
        { error: error?.message || "Reset failed" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const DELETE = withAuth(
  async (req, { params }) => {
    try {
      const { type, slug } = await params;

      const pageResult = await DB.pool(
        `SELECT created_by
         FROM html_pages
         WHERE slug = $1 AND page_group = $2`,
        [slug, type]
      );

      if (pageResult.rowCount === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      if (!canDeleteOwnedContent(req.user, pageResult.rows[0].created_by)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const query = `DELETE FROM html_pages WHERE slug = $1 AND page_group = $2 RETURNING *`;
      const result = await DB.pool(query, [slug, type]);

      if (result.rowCount === 0)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
      console.error("DELETE page failed", error);
      return NextResponse.json(
        { error: error?.message || "Delete failed" },
        { status: 500 }
      );
    }
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const PUT = withAuth(
  async (req, { params }) => {
    const data = await req.json();
    const { type, slug } = await params;

    let newData;
    try {
      newData = await getPageData(type, slug);
    } catch {
      return new NextResponse("not found", { status: 404 });
    }
    if (data.title) newData.title = data.title;
    if (data.page_order) newData.page_order = data.page_order;
    if (data.slug) newData.slug = data.slug;
    if (Object.prototype.hasOwnProperty.call(data, "description")) {
      newData.description = normalizePageDescription(data.description);
    }
    // Allow also empty content string.
    if (Object.prototype.hasOwnProperty.call(data, "content"))
      newData.content = sanitize(data.content);
    // Make sure that the slug only contains characters that do not need escaping
    // in the url. This ensures that the slug the user types can be used as-is
    // in the browser address bar.
    if (data.slug) newData.slug = sanitizeSlug(data.slug);

    if (newData.slug !== slug && (await slugIsInUse(type, newData.slug))) {
      return new NextResponse("Page slug already in use", {
        status: 400,
      });
    }

    newData.updated_by = req.user?.id ?? null;
    let updated = await setPageData(type, slug, newData);

    if (!updated && type === "grammar") {
      const insertQuery = `
    INSERT INTO html_pages (title, description, content, slug, page_group, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT DO NOTHING
  `;

      await DB.pool(insertQuery, [
        newData.title,
        newData.description ?? null,
        newData.content ?? "",
        newData.slug,
        type,
        req.user?.id ?? null,
        req.user?.id ?? null,
      ]);

      updated = await setPageData(type, slug, newData);
    }

    if (!updated) {
      console.log("PUT failed", {
        type,
        slug,
        newData,
      });

      return new NextResponse("Error updating HTML content", {
        status: 400,
      });
    }

    return new NextResponse("", { status: 200 });
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

export const POST = withAuth(
  async (req, { params }) => {
    const { type, slug } = await params;
    if (
      slug !== sanitizeSlug(slug) ||
      (await slugIsInUse(type, slug)) ||
      !VALID_PAGE_GROUPS.has(type)
    ) {
      return new NextResponse("Invalid slug", {
        status: 400,
      });
    }
    const { title, description } = await req.json();
    const query = `INSERT INTO html_pages (title, description, content, slug, page_group, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const result = await DB.pool(query, [
      title,
      normalizePageDescription(description),
      "",
      slug,
      type,
      req.user?.id ?? null,
      req.user?.id ?? null,
    ]);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Created" }, { status: 200 });
  },
  {
    requireAdmin: true,
    requireAuth: true,
  }
);

function sanitize(data) {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  const cleaned = purify.sanitize(data, {
    ADD_ATTR: ["target", "width", "height", "data-size"],
  });
  return normalizeTableSpacing(cleaned);
}

function isEffectivelyEmptyBlock(node) {
  if (!node || node.nodeType !== 1) {
    return false;
  }

  const tagName = String(node.tagName || "").toUpperCase();
  if (tagName !== "P" && tagName !== "DIV") {
    return false;
  }

  const text = String(node.textContent || "")
    .replace(/[\u00a0\u200b\ufeff]/g, " ")
    .trim();
  if (text.length > 0) {
    return false;
  }

  const meaningfulChildren = Array.from(node.children || []).filter(
    (child) => String(child.tagName || "").toUpperCase() !== "BR"
  );
  return meaningfulChildren.length === 0;
}

function hasExplicitBorderStyle(node) {
  if (!node || typeof node.getAttribute !== "function") {
    return false;
  }
  const style = String(node.getAttribute("style") || "");
  return /(^|;)\s*border(?:-(top|right|bottom|left))?\s*:/i.test(style);
}

function normalizeTableSpacing(html) {
  const dom = new JSDOM(`<div id="root">${String(html || "")}</div>`);
  const { document } = dom.window;
  const root = document.getElementById("root");
  if (!root) {
    return String(html || "");
  }

  // Keep user-intended border styles, but remove implicit border attributes
  // (for example border="1") when no explicit CSS border was set.
  root.querySelectorAll("table, td, th").forEach((node) => {
    if (node.hasAttribute("border") && !hasExplicitBorderStyle(node)) {
      node.removeAttribute("border");
    }
  });

  const tables = root.querySelectorAll("table");
  tables.forEach((table) => {
    let prev = table.previousElementSibling;
    while (isEffectivelyEmptyBlock(prev)) {
      const toRemove = prev;
      prev = prev.previousElementSibling;
      toRemove.remove();
    }

    let next = table.nextElementSibling;
    while (isEffectivelyEmptyBlock(next)) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }
  });

  while (isEffectivelyEmptyBlock(root.firstElementChild)) {
    root.firstElementChild.remove();
  }
  while (isEffectivelyEmptyBlock(root.lastElementChild)) {
    root.lastElementChild.remove();
  }

  return root.innerHTML;
}

async function slugIsInUse(type, slug) {
  try {
    await getPageData(type, slug);
    return true;
  } catch {
    // since getPage failed, slug is not in use
    return false;
  }
}

function sanitizeSlug(slug) {
  return slug.replace(/[^A-Za-z0-9\-\_\+]/g, "");
}
