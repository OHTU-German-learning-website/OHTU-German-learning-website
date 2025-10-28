import { DB } from "@/backend/db";

/*
This function fetches html content from database

parameter id: id of the content in table learning_pages_html

NOTE:   This function could be used to fetch html content to all pages, not just 
        for chapter pages, e.g. gradesa/resources/*. In that case, the database table 
        should be updated to include some kind of identifier other than id number 
        (chapter pages are named by numbers 1-5, so id number is enough in this case).
        In that case, it would also make sense to rename the table, and use the said 
        other identifier as parameter for this function.

*/
export async function getHTMLContent(id) {
  try {
    // get content from db using parameterized query
    const result = await DB.pool(
      "SELECT content FROM learning_pages_html WHERE id = $1",
      [id]
    );

    // if no page found for id, throw error
    if (result.rows.length === 0) {
      throw new Error("HTML page not found for id ${id}");
    }

    // if succesful, return the content. This should be html/React content
    return result.rows[0].content;
  } catch (error) {
    // in case of any errors, return error message in html (and write error to console)
    console.error("Error fetching HTML content: ", error);
    return "<p>Error loading page</p>";
  }
}

/*
This function updates html content in database for a specific id. Returns true if success, false otherwise.

parameter id: id of the page updated

parameter content: the content that will be updated

NOTE:   This function also might need to be updated if the functions in these files
        should be used to fetch and update any html content, and not just the chapter pages.
        In this case, same kind of modifications apply as seen above in function getHTMLContent(id) 
*/
export async function updateHTMLContent(id, content) {
  try {
    const result = await DB.pool(
      "UPDATE learning_pages_html SET content = $1 WHERE id = $2",
      [content, id]
    );
    if (result.rowCount == 1) {
      return true;
    }
    console.error(
      "Error updating HTML content, did not update one row with id  ",
      id
    );
  } catch (error) {
    console.error("Error fetching HTML content: ", error);
  }
  return false;
}
