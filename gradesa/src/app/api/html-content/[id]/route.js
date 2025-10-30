import { getHTMLContent, updateHTMLContent } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

/*
This route fetches html content from db according to id and page type
*/
export async function GET(req) {
  // create URL-object from request
  const url = new URL(req.url);

  // split path to segments
  const pathSegments = url.pathname.split("/");

  // get page type from url parameters
  const type = url.searchParams.get("type");

  // get last segment, which is the correct id of the page
  const id = pathSegments[pathSegments.length - 1];

  // returns correct db table based on url. Prevents malicious code
  const getTableType = (type) => {
    if (type == "resources") {
      return "learning_pages_html";
    } else if (type == "communications") {
      return "communications_pages_html";
    } else {
      return "";
    }
  };

  const content = await getHTMLContent(id, getTableType(type));

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
      return new Response("Invalid HTML detected", {
        status: 400,
      });
    }

    if (!(await updateHTMLContent(id, data.content))) {
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
