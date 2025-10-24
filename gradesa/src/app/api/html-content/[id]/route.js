import { getHTMLContent } from "@/backend/html-services";

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
