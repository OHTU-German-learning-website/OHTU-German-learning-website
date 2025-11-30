import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "../logging";

/**
 * Wraps a Next.js API route handler with Zod-based input validation.
 *
 * The wrapper reads the JSON body, validates it against the provided `schema`,
 * and forwards the request to `callback` with a new `NextRequest` whose body is
 * replaced by the validated payload. When validation fails, it returns a
 * `422 Unprocessable Entity` response including a human-readable error and the
 * Zod error details. Unexpected errors return `500`.
 *
 * Common usage:
 * - Compose with `withAuth` to enforce auth, then validate input.
 * - In the callback, call `await req.json()` to read the validated payload.
 *
 * @param {z.ZodTypeAny} schema - Zod schema describing expected request body.
 * @param {(req: NextRequest, res?: Response) => Promise<Response>|Response} callback -
 *   Handler invoked with a request whose body is the validated payload.
 * @returns {(req: NextRequest, res?: Response) => Promise<Response>} Wrapped handler.
 */
export const withInputValidation = (schema, callback) => {
  return async (req, res) => {
    const request = await req.json();
    const bodyData = request.body ? request.body : request;
    try {
      // Validate with Zod schema
      const validatedInput = schema.parse(bodyData);

      // Create a new request with the validated body
      const newRequest = new NextRequest(req.url, {
        headers: req.headers,
        method: req.method,
        body: JSON.stringify(validatedInput),
        cache: req.cache,
        credentials: req.credentials,
        integrity: req.integrity,
        mode: req.mode,
        redirect: req.redirect,
      });
      newRequest.testUser = req.testUser;
      newRequest.user = req.user;

      req = newRequest;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { humanReadableError, debugError } = humanReadableZodError(error);
        logger.error(
          `Input validation failed for ${req.url}: ${debugError}`,
          error.errors
        );
        logger.debug(error.errors, bodyData);
        return NextResponse.json(
          { error: humanReadableError, zodError: error.errors },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    return callback(req, res);
  };
};

/**
 * Produces human-readable and debug-friendly strings from a Zod error.
 *
 * @param {unknown} error - The thrown error, expected to be `z.ZodError`.
 * @returns {{ humanReadableError: string, debugError: string[] } | string}
 *   For Zod errors, returns a summary string and a list of field-specific messages;
 *   otherwise returns `error.toString()`.
 */
const humanReadableZodError = (error) => {
  if (!(error instanceof z.ZodError)) {
    return error.toString();
  }
  const humanReadableError = error.errors
    .map(({ message }) => {
      return message;
    })
    .join(", ");

  const debugError = error.errors.map(({ path, message }) => {
    const fieldPath = path.length ? path.join(".") : "input";
    return `${fieldPath}: ${message}`;
  });
  return { humanReadableError, debugError };
};
