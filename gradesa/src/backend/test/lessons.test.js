import { render, screen } from "@testing-library/react";
import { describe, it, test, expect, vi, beforeEach } from "vitest";
import LessonsPage from "../../app/lessons/page";
import mockRouter from "next/router";
import { useTestRequest } from "./mock-request";
import { NextRequest } from "next/server";

describe("GET /lessons/page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have response status 200", async () => {
    const { mockGet } = useTestRequest();
    const request = mockGet("/lessons/page");
    request.GET;

    const response = await GET(request);
    expect(response.status).toBe(200);
  });
});
