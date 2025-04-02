import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { NextResponse } from "next/server";
import { withInputValidation } from "./withInputValidation";

describe("withInputValidation middleware", () => {
  it("passes valid input to the callback and returns callback's result", async () => {
    // Define a simple schema
    const schema = z.object({
      name: z.string(),
    });

    const validData = { name: "Alice" };
    const req = { body: validData };
    const res = {};

    // Create a spy callback that returns a simple success response including the validated input.
    const callback = vi.fn(async (req, res) => {
      return { success: true, data: req.body };
    });

    const middleware = withInputValidation(schema, callback);
    const result = await middleware(req, res);

    // Verify that the callback was called, the input was set in req.body, and the result is as expected
    expect(callback).toHaveBeenCalled();
    expect(req.body).toEqual(validData);
    expect(result).toEqual({ success: true, data: validData });
  });

  it("returns a 422 response with an error message when validation fails", async () => {
    // Define a simple schema expecting a string for "name"
    const schema = z.object({
      name: z
        .string({
          message: "Invalid name",
        })
        .min(1, { message: "Name is required" }),
    });
    // Provide invalid input where name is not a string.
    const invalidData = { name: 123 };
    const invalidData2 = { name: "" };
    const invalidData3 = { name: null };
    const req = { body: invalidData };
    const res = {};

    // A dummy callback; it should not be called on validation failure.
    const callback = vi.fn();
    const middleware = withInputValidation(schema, callback);
    const result = await middleware(req, res);

    // Verify the returned response has a status of 422.
    expect(result.status).toBe(422);
    // Extract and check the error message.
    const json = await result.json();
    expect(json.error).toContain("Invalid name");
    // The callback should not have been called when validation fails.
    expect(callback).not.toHaveBeenCalled();

    const req2 = { body: invalidData2 };
    const result2 = await middleware(req2, res);
    expect(result2.status).toBe(422);
    const json2 = await result2.json();
    expect(json2.error).toContain("Name is required");

    const req3 = { body: invalidData3 };
    const result3 = await middleware(req3, res);
    expect(result3.status).toBe(422);
    const json3 = await result3.json();
    expect(json3.error).toContain("Invalid name");
  });

  it("rethrows errors that are not ZodErrors", async () => {
    // Create a dummy schema that throws a generic error (non-Zod)
    const faultySchema = {
      parse: () => {
        throw new Error("Generic Error");
      },
    };

    const req = { body: {} };
    const res = {};
    const callback = vi.fn();

    const middleware = withInputValidation(faultySchema, callback);
    // Verify that the middleware rethrows the generic error.
    await expect(middleware(req, res)).rejects.toThrow("Generic Error");
  });
});
