import { getPageData, setPageData } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { notFound } from "next/navigation";

export async function GET(req, { params }) {
  const { type, slug } = await params;
  try {
    const page = await getPageData(type, slug);

    return new Response(JSON.stringify({ page }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    notFound();
  }
}

export const PUT = withAuth(
  async (req, { params }) => {
    const data = await req.json();
    const { type, slug } = await params;

    let newData = await getPageData(type, slug);
    if (data.title) newData.title = data.title;
    if (data.page_order) newData.page_order = data.page_order;
    if (data.slug) newData.slug = data.slug;
    if (data.content) newData.content = sanitize(data.content);
    if (data.slug) newData.slug = data.slug;

    if (newData.slug !== slug && (await slugIsInUse(type, newData.slug))) {
      return new Response("Page slug already in use", {
        status: 400,
      });
    }

    if (!(await setPageData(type, slug, newData))) {
      return new Response("Error updating HTML content", {
        status: 400,
      });
    }
    return new Response("", { status: 200 });
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
