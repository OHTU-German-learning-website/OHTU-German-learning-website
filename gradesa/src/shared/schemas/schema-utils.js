import { z } from "zod";

/**
 * Converts a Zod error into a structured object that maps to form fields
 * This is useful for handling validation errors in forms
 *
 * @param {z.ZodError} error - The Zod error to convert
 * @param {Object} initialStructure - The initial structure to populate with errors
 * @returns {Object} An object with the same structure as initialStructure but with error messages
 */
export const zodErrorToFormErrors = (error, initialStructure = {}) => {
  if (!Array.isArray(error)) {
    console.debug("Not a zod error", error);
    return initialStructure;
  }

  const formErrors = { ...initialStructure };

  error.forEach((err) => {
    if (!err.path || !err.path.length) return;

    let current = formErrors;

    for (let i = 0; i < err.path.length - 1; i++) {
      const key = err.path[i];

      const nextIsNumber = !isNaN(parseInt(err.path[i + 1]));

      if (current[key] === undefined) {
        current[key] = nextIsNumber ? [] : {};
      }

      current = current[key];
    }

    const lastKey = err.path[err.path.length - 1];
    current[lastKey] = err.message;
  });

  return formErrors;
};
