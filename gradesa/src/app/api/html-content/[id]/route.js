import { getHTMLContent, updateHTMLContent } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

/*
This route fetches html content from db according to id
*/
export async function GET(req) {
  // create URL-object from request
  const url = new URL(req.url);

  // split path to segments
  const pathSegments = url.pathname.split("/");

  // get last segment, which is the correct id of the page
  const id = pathSegments[pathSegments.length - 1];

  // get content from db based on id
  const content = await getHTMLContent(id);

  // returns the fetched html as json
  return new Response(JSON.stringify({ content }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const PUT = withAuth(
  async (req, { params }) => {
    const data = await req.json();
    const { id } = await params;

    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    const cleaned = purify.sanitize(data.content, { ADD_ATTR: ["target"] });
    if (cleaned != data.content) {
      return new Response("<p>Invalid HTML detected</p>", {
        status: 400,
      });
    }

    if (!(await updateHTMLContent(id, data.content))) {
      return new Response("<p>Error updating HTML content</p>", {
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
