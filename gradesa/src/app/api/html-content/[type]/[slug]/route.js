import {
  getPageData,
  setPageData,
  updateHTMLContent,
} from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { NextResponse } from "next/server";

// Allowed page_group values stored in the consolidated `html_pages` table.
const VALID_PAGE_GROUPS = new Set(["resources", "communications"]);

/*
  Route behavior (summary):
  - The `type` route param maps to the `page_group` value stored in the
    consolidated `html_pages` table (values: `resources`, `communications`).
  - GET returns JSON `{ content: string }`. `getPageData` may return either
    a DB row object or (in tests) a raw HTML string; this handler normalizes
    both into the `content` string.
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

export async function GET(req, { params }) {
  const p = await params;
  const { type } = p;
  const slug = p.slug ?? p.id;
  const table = VALID_PAGE_GROUPS.has(type) ? type : "";
  try {
    const page = await getPageData(table, slug);
    // getPageData may return the DB row object or (in tests/mocks) a raw HTML
    // string. Normalize to a `content` string for the API response.
    const content = typeof page === "string" ? page : (page?.content ?? "");

    return new NextResponse(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}

export const PUT = withAuth(
  async (req, { params }) => {
    const data = await req.json();
    const p = await params;
    const { type } = p;
    const slug = p.slug ?? p.id;

    const table = VALID_PAGE_GROUPS.has(type) ? type : "";

    // If content is present (including empty string), sanitize and update only content
    if (Object.prototype.hasOwnProperty.call(data, "content")) {
      const cleaned = sanitize(data.content);
      if (!(await updateHTMLContent(table, slug, cleaned))) {
        return new NextResponse("Error updating HTML content", { status: 400 });
      }
      return new NextResponse("", { status: 200 });
    }

    // For other updates (title, slug, page_order) fall back to full page update
    let newData;
    try {
      newData = await getPageData(table, slug);
    } catch {
      return new NextResponse("not found", { status: 404 });
    }
    if (data.title) newData.title = data.title;
    if (data.page_order) newData.page_order = data.page_order;
    if (data.slug) newData.slug = data.slug.replace(/[^A-Za-z0-9\-\_\+]/g, "");

    if (newData.slug !== slug && (await slugIsInUse(table, newData.slug))) {
      return new NextResponse("Page slug already in use", {
        status: 400,
      });
    }

    if (!(await setPageData(table, slug, newData))) {
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
