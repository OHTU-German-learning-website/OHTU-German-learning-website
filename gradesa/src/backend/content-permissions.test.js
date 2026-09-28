import { describe, expect, it } from "vitest";
import {
  canAccessAdminView,
  canDeleteOwnedContent,
} from "./content-permissions";

describe("canDeleteOwnedContent", () => {
  it("allows superadmins to delete any content", () => {
    expect(
      canDeleteOwnedContent({ id: 1, is_admin: true, is_superadmin: true }, 99)
    ).toBe(true);
  });

  it("allows admins to delete their own content", () => {
    expect(
      canDeleteOwnedContent({ id: 7, is_admin: true, is_superadmin: false }, 7)
    ).toBe(true);
  });

  it("rejects admins deleting someone else's content", () => {
    expect(
      canDeleteOwnedContent({ id: 7, is_admin: true, is_superadmin: false }, 8)
    ).toBe(false);
  });

  it("rejects admins deleting content without an owner", () => {
    expect(
      canDeleteOwnedContent(
        { id: 7, is_admin: true, is_superadmin: false },
        null
      )
    ).toBe(false);
  });
});

describe("canAccessAdminView", () => {
  it("allows superadmins in any selected view", () => {
    const user = { id: 1, is_admin: true, is_superadmin: true };

    expect(canAccessAdminView(user, "user")).toBe(true);
    expect(canAccessAdminView(user, "admin")).toBe(true);
    expect(canAccessAdminView(user, "superadmin")).toBe(true);
  });

  it("requires an admin role for non-superadmin users", () => {
    const user = { id: 2, is_admin: true, is_superadmin: false };

    expect(canAccessAdminView(user, "user")).toBe(false);
    expect(canAccessAdminView(user, "admin")).toBe(true);
    expect(canAccessAdminView(user, "superadmin")).toBe(true);
  });

  it("blocks non-admin users even when they are on an admin view", () => {
    const user = { id: 3, is_admin: false, is_superadmin: false };

    expect(canAccessAdminView(user, "admin")).toBe(false);
    expect(canAccessAdminView(user, "superadmin")).toBe(false);
  });
});
