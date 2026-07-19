import { describe, expect, it } from "vitest";
import { canDeleteOwnedContent } from "./content-permissions";

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
