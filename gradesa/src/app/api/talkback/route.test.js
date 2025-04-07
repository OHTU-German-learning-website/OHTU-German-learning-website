import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { checkSession } from "@/backend/auth/session";
console.log("Mocked checkSession:", checkSession.mock);

// Mock MailerSend
vi.mock("mailersend", () => {
  return {
    MailerSend: vi.fn().mockImplementation(() => ({
      email: {
        send: vi.fn().mockResolvedValue(Promise.resolve()),
      },
    })),
    EmailParams: vi.fn().mockImplementation(() => ({
      setFrom: vi.fn().mockReturnThis(),
      setTo: vi.fn().mockReturnThis(),
      setReplyTo: vi.fn().mockReturnThis(),
      setSubject: vi.fn().mockReturnThis(),
      setHtml: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
    })),
    Sender: vi.fn(),
    Recipient: vi.fn(),
  };
});

describe("POST /api/talkback", () => {
  const { mockPost } = useTestRequest();

  vi.mock("@/backend/auth/session", () => ({
    //checkSession: vi.fn().mockResolvedValue("mockUserId"),
    checkSession: vi.fn().mockResolvedValue({ id: "mockUserId" }),
  }));

  vi.mock("../../../backend/db", () => ({
    DB: {
      pool: vi.fn().mockResolvedValue({ rows: [] }), // No previous feedbacks
    },
  }));

  const sendFeedbackRequest = async (email, complaint) => {
    const request = mockPost("/api/talkback", { email, complaint });
    const response = await POST(request);
    const result = await response.json();
    return { status: response.status, ...result };
  };

  it("should return 400 if email or complaint is missing", async () => {
    const result = await sendFeedbackRequest("", "");
    expect(result.status).toBe(400);
    expect(result.message).toBe("Email and complaint are required");
  });

  it("should return 200 on successful email send", async () => {
    const mailersend = await import("mailersend"); // Import the mocked module

    const result = await sendFeedbackRequest(
      "test@example.com",
      "Test complaint"
    );

    expect(result.status).toBe(200);
    expect(result.message).toBe("Feedback received and email sent");

    // Ensure MailerSend's send method was called
    expect(mailersend.MailerSend).toHaveBeenCalled(); // Check if MailerSend was instantiated
    expect(
      mailersend.MailerSend.mock.results[0].value.email.send
    ).toHaveBeenCalled(); // Check if send() was called
  });

  it("should return 500 if MailerSend throws an error", async () => {
    // Force MailerSend to fail
    const mailersend = await import("mailersend");
    mailersend.MailerSend.mockImplementationOnce(() => ({
      email: {
        send: vi.fn().mockRejectedValue(new Error("MailerSend failure")),
      },
    }));

    const result = await sendFeedbackRequest(
      "test@example.com",
      "Test complaint"
    );
    expect(result.status).toBe(500);
    expect(result.message).toBe("Error processing feedback");
    expect(result.error).toBe("MailerSend failure");

    // Ensure send() was attempted
    expect(mailersend.MailerSend).toHaveBeenCalled();
    expect(
      mailersend.MailerSend.mock.results[0].value.email.send
    ).toHaveBeenCalled();
  });
});
