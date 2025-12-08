import { getPageData, setPageData } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { NextResponse } from "next/server";
import { DB } from "@/backend/db";

// Allowed page_group values stored in the consolidated `html_pages` table.
const VALID_PAGE_GROUPS = new Set(["resources", "communications", "grammar"]);

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

export const DELETE = withAuth(
  async (req, { params }) => {
    const { type, slug } = await params;

    const query = `DELETE FROM html_pages WHERE slug = $1 AND page_group = $2 RETURNING *`;
    const result = await DB.pool(query, [slug, type]);

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
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

    if (!(await setPageData(type, slug, newData))) {
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
    const title = (await req.json()).title;
    const query = `INSERT INTO html_pages (title, content, slug, page_group) VALUES ($1, $2, $3, $4)`;
    const result = await DB.pool(query, [title, "", slug, type]);

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
  const cleaned = purify.sanitize(data, { ADD_ATTR: ["target"] });
  return cleaned;
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
