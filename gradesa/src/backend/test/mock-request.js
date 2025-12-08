import { NextRequest } from "next/server";
import { getConfig } from "@/backend/config";
import { v4 as uuidv4 } from "uuid";

const requestWithUser = (user, sessionId, ...params) => {
  const headers = new Headers();
  headers.append("X-Session-Id", sessionId);
  const req = new NextRequest(...params, { headers });
  req.testUser = user;
  return req;
};

// Helper function for tests that returns get, post, put and mockParams functions
// These functions return a NextRequest object with the user and sessionId set
// It allows you to easily test nextJS handlers with a proper request object
export function useTestRequest(user) {
  const config = getConfig();
  const sessionId = uuidv4();
  return {
    mockGet: (url) =>
      requestWithUser(user, sessionId, `${config.apiUrl}${url}`, {
        method: "GET",
      }),
    mockPost: (url, data) =>
      requestWithUser(user, sessionId, `${config.apiUrl}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    mockDelete: (url) =>
      requestWithUser(user, sessionId, `${config.apiUrl}${url}`, {
        method: "DELETE",
      }),
    mockPut: (url, data) =>
      requestWithUser(user, sessionId, `${config.apiUrl}${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    mockParams: (params) => ({
      params: new Promise((resolve) => resolve(params)),
    }),
  };
}
