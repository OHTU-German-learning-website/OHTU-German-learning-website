import { getPageData, setPageData } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { type, slug } = await params;
  try {
    const page = await getPageData(type, slug);

    return new NextResponse(JSON.stringify({ page }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}

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
    if (data.content) newData.content = sanitize(data.content);
    if (data.slug) newData.slug = data.slug.replace(/[^A-Za-z0-9\-\_\+]/g, "");

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
