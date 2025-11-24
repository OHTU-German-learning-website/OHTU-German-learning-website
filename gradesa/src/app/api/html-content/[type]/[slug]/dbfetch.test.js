import { describe, it, expect, vi, beforeEach } from "vitest";
import DOMPurify from "dompurify";

vi.mock("@/backend/html-services", () => ({
  // Mock exports used by the route under test.
  setPageData: vi.fn(),
  getPageData: vi.fn(),
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
import { getPageData, setPageData } from "@/backend/html-services";

describe("GET /api/html-content/[type]/[id]", () => {
  useTestDatabase();

  beforeEach(() => {
    vi.resetAllMocks();
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

const pageData = {
  title: "title",
  content: "<p>Mocked HTML</p>",
  page_order: 1,
  slug: "1",
  page_group: "resources",
};

describe("PUT /api/html-content/[type]/[slug]", () => {
  useTestDatabase();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const putRequest = async (type, slug, content) => {
    const { mockPut } = useTestRequest();
    const req = mockPut(`/api/html-content/${type}/${slug}`, {
      body: { content },
    });
    req.json = async () => ({ content });
    return PUT(req, { params: { type, slug } });
  };

  it("should sanitize and update HTML content", async () => {
    getPageData
      .mockResolvedValueOnce(pageData)
      .mockRejectedValueOnce(new Error("Something went wrong"));
    setPageData.mockResolvedValueOnce(true);

    const response = await putRequest("resources", "1", "<p>Mocked HTML</p>");
    expect(response.status).toBe(200);
    expect(setPageData).toHaveBeenCalledWith("resources", "1", pageData);
  });

  it("should sanitize HTML using DOMPurify before saving", async () => {
    const sanitizeMock = vi.fn(() => "<p>clean</p>");
    vi.mocked(DOMPurify).mockReturnValueOnce({ sanitize: sanitizeMock });
    getPageData.mockResolvedValue(pageData);
    setPageData.mockResolvedValueOnce(true);

    const response = await putRequest(
      "resources",
      "1",
      "<script><kbd></script>"
    );

    expect(sanitizeMock).toHaveBeenCalledWith("<script><kbd></script>", {
      ADD_ATTR: ["target"],
    });
    expect(setPageData).toHaveBeenCalledWith("resources", "1", {
      title: "title",
      content: "<p>clean</p>",
      page_order: 1,
      slug: "1",
      page_group: "resources",
    });
    expect(response.status).toBe(200);
  });

  it("should allow an admin to save an empty editor file", async () => {
    getPageData.mockResolvedValue(pageData);
    setPageData.mockResolvedValueOnce(true);
    const response = await putRequest("resources", "1", "");
    expect(setPageData).toHaveBeenCalledWith("resources", "1", {
      title: "title",
      content: "",
      page_order: 1,
      slug: "1",
      page_group: "resources",
    });
    expect(response.status).toBe(200);
  });

  it("should return error if updateHTMLContent fails", async () => {
    getPageData.mockResolvedValue(pageData);
    setPageData.mockResolvedValueOnce(false);
    const response = await putRequest("resources", "1", "failure");
    expect(response.status).toBe(400);
  });
});
