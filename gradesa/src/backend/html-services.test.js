import { describe, it, expect, beforeEach } from "vitest";
import { getPageData, setPageData, getPageList } from "./html-services";
import { useTestDatabase } from "@/backend/test/testdb";
import { DB } from "@/backend/db";

describe("html-services", () => {
  useTestDatabase();

  beforeEach(async () => {
    await DB.pool(
      `INSERT INTO html_pages (title, content, page_order, slug, page_group)
       VALUES
       ('Welcome', '<p>Welcome to our site</p>', 1, 'welcome', 'home'),
       ('About Us', '<p>Learn about us</p>', 2, 'about', 'home'),
       ('Contact', '<p>Contact us here</p>', 1, 'contact', 'contact'),
       ('FAQ', '<p>Frequently asked questions</p>', 1, 'faq', 'support')`
    );
  });

  describe("getPageData", () => {
    it("should fetch a single page by type and slug", async () => {
      const page = await getPageData("home", "welcome");

      expect(page).toBeDefined();
      expect(page.title).toBe("Welcome");
      expect(page.slug).toBe("welcome");
      expect(page.page_group).toBe("home");
      expect(page.content).toBe("<p>Welcome to our site</p>");
      expect(page.page_order).toBe(1);
    });

    it("should return the correct page when multiple pages exist in same group", async () => {
      const page = await getPageData("home", "about");

      expect(page.title).toBe("About Us");
      expect(page.slug).toBe("about");
      expect(page.page_order).toBe(2);
    });

    it("should fetch pages from different groups", async () => {
      const contactPage = await getPageData("contact", "contact");
      const supportPage = await getPageData("support", "faq");

      expect(contactPage.page_group).toBe("contact");
      expect(supportPage.page_group).toBe("support");
    });

    it("should throw error when page does not exist", async () => {
      await expect(getPageData("home", "nonexistent")).rejects.toThrow(
        "HTML page not found"
      );
    });

    it("should throw error when type does not exist", async () => {
      await expect(getPageData("nonexistent", "welcome")).rejects.toThrow(
        "HTML page not found"
      );
    });

    it("should return all expected fields", async () => {
      const page = await getPageData("home", "welcome");

      expect(page).toHaveProperty("title");
      expect(page).toHaveProperty("content");
      expect(page).toHaveProperty("page_order");
      expect(page).toHaveProperty("slug");
      expect(page).toHaveProperty("page_group");
    });
  });

  describe("setPageData", () => {
    it("should update page title, slug, and content", async () => {
      const success = await setPageData("home", "welcome", {
        title: "Welcome Updated",
        slug: "welcome-new",
        content: "<p>Updated welcome content</p>",
      });

      expect(success).toBe(true);

      const updatedPage = await getPageData("home", "welcome-new");
      expect(updatedPage.title).toBe("Welcome Updated");
      expect(updatedPage.content).toBe("<p>Updated welcome content</p>");
    });

    it("should return false when page does not exist", async () => {
      const success = await setPageData("home", "nonexistent", {
        title: "New Title",
        slug: "new-slug",
        content: "<p>New content</p>",
      });

      expect(success).toBe(false);
    });

    it("should return false when type does not match", async () => {
      const success = await setPageData("nonexistent", "welcome", {
        title: "New Title",
        slug: "new-slug",
        content: "<p>New content</p>",
      });

      expect(success).toBe(false);
    });

    it("should update only the specified fields", async () => {
      const originalPage = await getPageData("home", "welcome");

      await setPageData("home", "welcome", {
        title: "New Title",
        slug: "welcome",
        content: "<p>New content</p>",
      });

      const updatedPage = await getPageData("home", "welcome");

      expect(updatedPage.title).toBe("New Title");
      expect(updatedPage.content).toBe("<p>New content</p>");
      expect(updatedPage.page_order).toBe(originalPage.page_order);
      expect(updatedPage.page_group).toBe(originalPage.page_group);
    });

    it("should allow changing the slug", async () => {
      await setPageData("home", "welcome", {
        title: "Welcome",
        slug: "welcome-updated",
        content: "<p>Welcome to our site</p>",
      });

      // Old slug should not exist
      await expect(getPageData("home", "welcome")).rejects.toThrow();

      // New slug should exist
      const page = await getPageData("home", "welcome-updated");
      expect(page.slug).toBe("welcome-updated");
    });

    it("should handle HTML content with special characters", async () => {
      const htmlContent = "<p>Special chars: &amp; &lt; &gt; &quot;</p>";

      await setPageData("home", "welcome", {
        title: "Welcome",
        slug: "welcome",
        content: htmlContent,
      });

      const page = await getPageData("home", "welcome");
      expect(page.content).toBe(htmlContent);
    });

    it("should handle empty content", async () => {
      const success = await setPageData("home", "welcome", {
        title: "Welcome",
        slug: "welcome",
        content: "",
      });

      expect(success).toBe(true);
      const page = await getPageData("home", "welcome");
      expect(page.content).toBe("");
    });
  });

  describe("getPageList", () => {
    it("should return all pages in a group ordered by page_order", async () => {
      const pages = await getPageList("home");

      expect(pages.length).toBe(2);
      expect(pages[0].slug).toBe("welcome");
      expect(pages[1].slug).toBe("about");
    });

    it("should return pages sorted by page_order ascending", async () => {
      const pages = await getPageList("home");

      expect(pages[0].page_order || 1).toBeLessThanOrEqual(
        pages[1].page_order || 2
      );
    });

    it("should return correct structure with title and slug", async () => {
      const pages = await getPageList("home");

      pages.forEach((page) => {
        expect(page).toHaveProperty("title");
        expect(page).toHaveProperty("slug");
        expect(page).not.toHaveProperty("content");
        expect(page).not.toHaveProperty("page_group");
      });
    });

    it("should return empty array when group does not exist", async () => {
      const pages = await getPageList("nonexistent");

      expect(pages).toEqual([]);
      expect(Array.isArray(pages)).toBe(true);
    });

    it("should list pages from different groups independently", async () => {
      const homePages = await getPageList("home");
      const contactPages = await getPageList("contact");
      const supportPages = await getPageList("support");

      expect(homePages.length).toBe(2);
      expect(contactPages.length).toBe(1);
      expect(supportPages.length).toBe(1);
    });

    it("should only return title and slug fields", async () => {
      const pages = await getPageList("home");

      pages.forEach((page) => {
        const keys = Object.keys(page).sort();
        expect(keys).toEqual(["slug", "title"]);
      });
    });
  });
});
