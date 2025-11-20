import { describe, it, expect, vi, beforeEach } from "vitest";
import DOMPurify from "dompurify";

vi.mock("@/backend/html-services", () => ({
  // Mock exports used by the route under test. `getPageData` is used by the
  // GET and non-content PUT flows; `updateHTMLContent` is used for content-only
  // PUT updates (allows empty-string content handling).
  getHTMLContent: vi.fn(),
  getPageData: vi.fn(),
  updateHTMLContent: vi.fn(),
}));

vi.mock("dompurify", () => ({
  __esModule: true,
  default: vi.fn(() => ({ sanitize: (html) => html })),
}));

vi.mock("jsdom", () => ({
  JSDOM: vi.fn().mockImplementation(() => ({ window: {} })),
}));

vi.mock("@/backend/middleware/withAuth", () => ({
  withAuth: vi.fn((handler) => handler),
}));

import { GET, PUT } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { getPageData } from "@/backend/html-services";
import { updateHTMLContent } from "@/backend/html-services";

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
    getPageData.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("resources", 1);
    const body = await response.json();

    expect(getPageData).toHaveBeenCalledWith("resources", 1);
    expect(response.status).toBe(200);
    expect(body).toEqual({ content: "<p>Mocked HTML</p>" });
  });

  it("should call correct table for communications type", async () => {
    getPageData.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("communications", 5);
    await response.json();

    expect(getPageData).toHaveBeenCalledWith("communications", 5);
  });

  it("should return empty string table if type is invalid", async () => {
    getPageData.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest("unknown", 3);
    await response.json();

    expect(getPageData).toHaveBeenCalledWith("", 3);
  });
});

describe("PUT /api/html-content/[type]/[id]", () => {
  useTestDatabase();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const putRequest = async (type, id, content) => {
    const { mockPut } = useTestRequest();
    const req = mockPut(`/api/html-content/${type}/${id}`, {
      body: { content },
    });
    req.json = async () => ({ content });
    return PUT(req, { params: { type, id } });
  };

  it("should sanitize and update HTML content", async () => {
    updateHTMLContent.mockResolvedValueOnce(true);

    const response = await putRequest("resources", 1, "<p>Mocked HTML</p>");
    expect(response.status).toBe(200);
    expect(updateHTMLContent).toHaveBeenCalledWith(
      "resources",
      1,
      "<p>Mocked HTML</p>"
    );
  });

  it("should sanitize HTML using DOMPurify before saving", async () => {
    const sanitizeMock = vi.fn(() => "<p>clean</p>");
    vi.mocked(DOMPurify).mockReturnValueOnce({ sanitize: sanitizeMock });
    updateHTMLContent.mockResolvedValueOnce(true);

    const response = await putRequest("resources", 1, "<script><kbd></script>");

    expect(sanitizeMock).toHaveBeenCalledWith("<script><kbd></script>", {
      ADD_ATTR: ["target"],
    });
    expect(updateHTMLContent).toHaveBeenCalledWith(
      "resources",
      1,
      "<p>clean</p>"
    );
    expect(response.status).toBe(200);
  });

  it("should allow an admin to save an empty editor file", async () => {
    updateHTMLContent.mockResolvedValueOnce(true);
    const response = await putRequest("resources", 1, "");
    expect(updateHTMLContent).toHaveBeenCalledWith("resources", 1, "");
    expect(response.status).toBe(200);
  });

  it("should return error if updateHTMLContent fails", async () => {
    updateHTMLContent.mockResolvedValueOnce(false);
    const response = await putRequest("resources", 1, "failure");
    expect(response.status).toBe(400);
  });
});
