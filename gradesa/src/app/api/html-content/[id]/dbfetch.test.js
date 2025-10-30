import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { getHTMLContent } from "@/backend/html-services";

vi.mock("@/backend/html-services", () => ({
  getHTMLContent: vi.fn(),
}));

describe("GET /api/html-content/[id]", () => {
  useTestDatabase();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getRequest = async (id) => {
    const { mockGet } = useTestRequest();
    const req = mockGet(`/api/html-content/${id}`);
    return GET(req);
  };

  it("should return HTML content as JSON", async () => {
    getHTMLContent.mockResolvedValueOnce("<p>Mocked HTML</p>");

    const response = await getRequest(1);
    const body = await response.json();

    expect(getHTMLContent).toHaveBeenCalledWith("1");
    expect(response.status).toBe(200);
    expect(body).toEqual({ content: "<p>Mocked HTML</p>" });
  });

  it("should return null if content not found", async () => {
    getHTMLContent.mockResolvedValueOnce(null);

    const response = await getRequest(999);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ content: null });
  });

  it("should throw on DB errors", async () => {
    getHTMLContent.mockRejectedValueOnce(new Error("DB failure"));

    await expect(getRequest(1)).rejects.toThrow("DB failure");
  });
});
