import { useEffect, useState } from "react";

/*
This function returns HTML/React content, that was fetched from db.
The returned content can be used by js functions that are used to render individual pages.

parameter contentId: id of the HTML content in db

NOTE:   Currently this function fetches content corresponding to id. This is ok when rendering
        lesson pages, since they are named 1-n. This function could be used to render any page content,
        if the fetching function was changed in backend to find content based on some other identifier.
        This function probably doens't need any changes, but at this moment it is only used to render chapter pages.

NOTE:   This function could be enhanced by providing HTML sanitizing before returning content.
        One option for this would be using dompurify sanitizer
*/
export default function RenderHTML({ contentId }) {
  // create state for HTML content
  const [html, setHtml] = useState("");

  // React hook for running function after mounting of component, and when contentId is changed
  useEffect(() => {
    // function to fetch HTML content using html-services, and set it to state html
    async function fetchHTML() {
      // fetch response through next.js route using getHTMLContent function
      const res = await fetch(`/api/html-content/${contentId}`);

      // chnages the response to proper json
      const data = await res.json();

      // change html state to what was fetched
      setHtml(data.content);
    }

    fetchHTML();
  }, [contentId]);

  // return HTML content "dangerously", e.g. without sanitazing
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
