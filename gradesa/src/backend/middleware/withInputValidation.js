import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "../logging";

export const withInputValidation = (schema, callback) => {
  return async (req, res) => {
    try {
      const validatedInput = schema.parse(req.body);
      req.body = validatedInput;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = humanReadableZodError(error);
        logger.error(
          `Input validation failed for ${req.url}: ${errorMessage}`,
          error.errors,
          req.body
        );
        return NextResponse.json({ error: errorMessage }, { status: 422 });
      }
      throw error;
    }

    return callback(req, res);
  };
};

const humanReadableZodError = (error) => {
  if (!(error instanceof z.ZodError)) {
    return error.toString();
  }
  return error.errors
    .map(({ path, message }) => {
      const fieldPath = path.length ? path.join(".") : "input";
      return `${fieldPath}: ${message}`;
    })
    .join("; ");
};
