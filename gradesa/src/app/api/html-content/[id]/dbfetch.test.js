import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/backend/html-services", () => ({
  getHTMLContent: vi.fn(),
}));

vi.mock("dompurify", () => ({
  __esModule: true,
  default: () => ({ sanitize: (html) => html }),
}));

vi.mock("jsdom", () => ({
  JSDOM: vi.fn().mockImplementation(() => ({ window: {} })),
}));

import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { getHTMLContent } from "@/backend/html-services";

describe("GET /api/html-content/[id]", () => {
  useTestDatabase();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRequest = async (id, type = "resources") => {
    const { mockGet } = useTestRequest();
    const req = mockGet(`/api/html-content/${id}?type=${type}`);
    return GET(req);
  };

  it("should return HTML content as JSON", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest(1, "resources");
    const body = await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("1", "learning_pages_html");
    expect(response.status).toBe(200);
    expect(body).toEqual({ content: "<p>Mocked HTML</p>" });
  });

  it("should call correct table for communications type", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest(5, "communications");
    await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith(
      "5",
      "communications_pages_html"
    );
  });

  it("should return empty string table if type is invalid", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest(3, "unknown");
    await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("3", "");
  });
});
