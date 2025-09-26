import { getHTMLContent } from "@/backend/html-services";

/*
This route fetches html content from db according to id
*/
export async function GET(req, { params }) {
  const { id } = params;
  const content = await getHTMLContent(id);

  return new Response(JSON.stringify({ content }), {
    headers: { "Content-Type": "application/json" },
  });
}
