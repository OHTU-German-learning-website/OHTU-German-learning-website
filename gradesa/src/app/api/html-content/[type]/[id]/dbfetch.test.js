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

describe("GET /api/html-content/[type]/[id]", () => {
  useTestDatabase();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRequest = async (type, id) => {
    const { mockGet } = useTestRequest();
    const req = mockGet(`/api/html-content/${type}/${id}`);
    return GET(req, { params: { type, id } });
  };

  it("should return HTML content as JSON", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("resources", 1);
    const body = await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("learning_pages_html", 1);
    expect(response.status).toBe(200);
    expect(body).toEqual({ content: "<p>Mocked HTML</p>" });
  });

  it("should call correct table for communications type", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("communications", 5);
    await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("communications_pages_html", 5);
  });

  it("should return empty string table if type is invalid", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("unknown", 3);
    await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("", 3);
  });
});
