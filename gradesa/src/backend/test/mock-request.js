import { NextRequest } from "next/server";
import { getConfig } from "@/backend/config";

export function useTestRequest() {
  const config = getConfig();
  return {
    mockGet: (url) =>
      new NextRequest(`${config.apiUrl}${url}`, {
        method: "GET",
      }),
    mockPost: (url, data) =>
      new NextRequest(`${config.apiUrl}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    mockParams: async (params) => params,
  };
}
