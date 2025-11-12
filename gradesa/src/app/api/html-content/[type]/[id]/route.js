import { getHTMLContent, updateHTMLContent } from "@/backend/html-services";
import { withAuth } from "@/backend/middleware/withAuth";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

/*
This route fetches html content from db according to id and page type
*/
export async function GET(req, { params }) {
  const { type, id } = await params;
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

  const content = await getHTMLContent(getTableType(type), id);

  // returns the fetched html as json
  return new Response(JSON.stringify({ content }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const PUT = withAuth(
  async (req, { params }) => {
    const data = await req.json();
    const { type, id } = await params;

    const getTableType = (type) => {
      if (type == "resources") {
        return "learning_pages_html";
      } else if (type == "communications") {
        return "communications_pages_html";
      } else {
        return "";
      }
    };

    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    const cleaned = purify.sanitize(data.content, { ADD_ATTR: ["target"] });

    if (!(await updateHTMLContent(getTableType(type), id, cleaned))) {
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
