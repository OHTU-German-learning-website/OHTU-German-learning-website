import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { NextResponse } from "next/server";
import { withInputValidation } from "./withInputValidation";
import { useTestRequest } from "@/backend/test/mock-request";

describe("withInputValidation middleware", () => {
  const getTestCallback = (data) => {
    const { mockPost } = useTestRequest();
    const request = mockPost("/dummy", data);
    const callback = vi.fn(async (r) => {
      return NextResponse.json({ success: true, data: await r.json() });
    });
    return { callback, request };
  };
  it("passes valid input to the callback and returns callback's result", async () => {
    const schema = z.object({
      name: z.string(),
    });

    const validData = { name: "Alice" };
    const { callback, request } = getTestCallback(validData);

    const middleware = withInputValidation(schema, callback);
    const result = await middleware(request);
    const response = await result.json();
    expect(result.status).toBe(200);
    expect(response).toEqual({ success: true, data: validData });
  });

  it("returns a 422 response with an error message when validation fails", async () => {
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

    const { callback, request } = getTestCallback(invalidData);
    const middleware = withInputValidation(schema, callback);
    const result = await middleware(request);

    expect(result.status).toBe(422);
    const json = await result.json();
    expect(json.error).toContain("Invalid name");
    // The callback should not have been called when validation fails.
    expect(callback).not.toHaveBeenCalled();

    const { callback: callback2, request: request2 } =
      getTestCallback(invalidData2);
    const result2 = await middleware(request2);
    expect(result2.status).toBe(422);
    const json2 = await result2.json();
    expect(json2.error).toContain("Name is required");

    const { callback: callback3, request: request3 } =
      getTestCallback(invalidData3);
    const result3 = await middleware(request3);
    expect(result3.status).toBe(422);
    const json3 = await result3.json();
    expect(json3.error).toContain("Invalid name");
  });

  it("rethrows errors that are not ZodErrors", async () => {
    const faultySchema = {
      parse: () => {
        throw new Error("Generic Error");
      },
    };

    const { callback, request } = getTestCallback({});

    const middleware = withInputValidation(faultySchema, callback);
    const result = await middleware(request);
    const json = await result.json();
    expect(json.error).toBe("Something went wrong");
    expect(result.status).toBe(500);
  });
});
