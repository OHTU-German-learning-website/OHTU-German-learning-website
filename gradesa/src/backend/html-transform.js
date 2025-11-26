import { JSDOM } from "jsdom";

/**
 * Transforms HTML content by replacing <p> and <li> tags with custom glossary tags
 * @param {string} htmlString - The HTML content to transform
 * @returns {string} - Transformed HTML with GlossaryParagraph and GlossaryListItem tags
 */
export function transformHtmlToGlossaryTags(htmlString) {
  if (!htmlString || typeof htmlString !== "string") {
    return htmlString;
  }

  try {
    // Parse HTML using jsdom
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // Define transformation mappings
    const transformations = [
      {
        selector: "p",
        newTag: "GlossaryParagraph",
        skipParent: "glossaryparagraph",
      },
      {
        selector: "li",
        newTag: "GlossaryListItem",
        skipParent: "glossarylistitem",
      },
    ];

    // Apply transformations
    transformations.forEach(({ selector, newTag, skipParent }) => {
      transformElements(document, selector, newTag, skipParent);
    });

    // Return transformed HTML
    return document.body.innerHTML;
  } catch (error) {
    console.error("Error transforming HTML to glossary tags:", error);
    // Return original HTML if transformation fails
    return htmlString;
  }
}

/**
 * Transform all elements matching a selector to a new tag name
 * @param {Document} document - The DOM document
 * @param {string} selector - CSS selector for elements to transform
 * @param {string} newTag - New tag name to use
 * @param {string} skipParent - Skip transformation if element is inside this parent tag
 */
function transformElements(document, selector, newTag, skipParent) {
  const elements = Array.from(document.querySelectorAll(selector));

  elements.forEach((element) => {
    // Skip if already inside a transformed parent
    if (element.closest(skipParent)) {
      return;
    }

    // Create new element with custom tag name
    const newElement = document.createElement(newTag);

    // Copy all attributes from original element
    Array.from(element.attributes).forEach((attr) => {
      newElement.setAttribute(attr.name, attr.value);
    });

    // Move all child nodes to new element (more efficient than innerHTML)
    while (element.firstChild) {
      newElement.appendChild(element.firstChild);
    }

    // Replace original element with new element
    element.replaceWith(newElement);
  });
}
