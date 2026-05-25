import { describe, it, expect } from "vitest";
import { middleware } from "./middleware";

function createRequest(pathname, hasCookie = false) {
  return {
    url: `http://localhost/gradesa${pathname}`,
    nextUrl: {
      pathname: `/gradesa${pathname}`,
    },
    cookies: {
      get: () => (hasCookie ? { value: "session-cookie" } : undefined),
    },
  };
}

describe("middleware", () => {
  it("redirects logged-out users from exercises to registration", async () => {
    const response = await middleware(createRequest("/grammar/exercises"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/register");
    expect(response.headers.get("location")).toContain(
      "redirect=%2Fgrammar%2Fexercises"
    );
  });

  it("redirects logged-out users from contact to registration", async () => {
    const response = await middleware(createRequest("/contact"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/register");
  });

  it("redirects other protected paths to login", async () => {
    const response = await middleware(createRequest("/edit_info"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/auth/login");
  });
});
