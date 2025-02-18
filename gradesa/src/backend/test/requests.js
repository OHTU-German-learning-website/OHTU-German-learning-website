import { NextRequest } from "next/server";
import { getConfig } from "@/backend/config";

export function useTestRequest() {
  const config = getConfig();
  return {
    mockGet: (url) =>
      new NextRequest(`${config.apiUrl}${url}`, {
        method: "GET",
      }),
    mockParams: async (params) => params,
  };
}
