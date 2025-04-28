import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "../logging";

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
