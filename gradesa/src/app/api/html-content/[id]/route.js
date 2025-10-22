import { getHTMLContent } from "@/backend/html-services"; // ,updateHTMLContent

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

//For saving edited content:
// export async function PUT(req) {

//  const url = new URL(req.url);
//  const pathSegments = url.pathname.split("/");
//  const id = pathSegments[pathSegments.length - 1];
//  const body = await req.json();
//  const {content} = body;

//  await updateHTMLContent(id, content);
