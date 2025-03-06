import { NextRequest } from "next/server";
import { getConfig } from "@/backend/config";

const requestWithUser = (user, ...params) => {
  const req = new NextRequest(...params);
  req.user = user;
  return req;
};

export function useTestRequest(user) {
  const config = getConfig();
  return {
    mockGet: (url) =>
      requestWithUser(user, `${config.apiUrl}${url}`, {
        method: "GET",
      }),
    mockPost: (url, data) =>
      requestWithUser(user, `${config.apiUrl}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    mockPut: (url, data) =>
      requestWithUser(user, `${config.apiUrl}${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    mockParams: (params) => ({
      params: new Promise((resolve) => resolve(params)),
    }),
  };
}
