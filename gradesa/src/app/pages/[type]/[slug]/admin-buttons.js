"use client";

import { checkIsAdmin as useIsAdmin } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Row } from "@/components/ui/layout/container";
import { useSearchParams } from "next/navigation";

export default function AdminButtons({ type, slug, pageExists = true }) {
  const { setActAs } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  /** Reset: empties the page content but keeps the page row. */
  const handleReset = async () => {
    if (!confirm("Möchten Sie den Inhalt dieser Seite wirklich leeren?"))
      return;
    const res = await fetch(`/api/admin/pages/${type}/${slug}`, {
      method: "PATCH",
    });

    if (res.ok) {
      router.refresh();
      return;
    }

    const message = await res.text();
    alert(
      `Fehler beim Zurücksetzen (HTTP ${res.status}): ${message || "Unbekannter Fehler"}`
    );
  };

  const getPagePath = (pageType, pageSlug) => {
    if (pageType === "grammar") {
      const query = view ? `?view=${view}` : "";
      return `/grammar/themes/${pageSlug}${query}`;
    }

    return `/pages/${pageType}/${pageSlug}`;
  };

  const getFallbackPath = (pageType) => {
    if (pageType === "grammar") return "/grammar/themes";
    if (pageType === "resources") return "/learning";
    return `/pages/${pageType}`;
  };

  /** Delete: removes the whole page row from the database. */
  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Seite wirklich endgültig löschen?")) return;

    // Redirect behavior by type:
    // - grammar: go to /grammar/themes
    // - communications: go to /pages/communications
    // - resources (Lernen): go to previous page if it exists, else /learning
    let redirectPath;
    if (type === "grammar") {
      redirectPath = "/grammar/themes";
    } else if (type === "communications") {
      redirectPath = "/pages/communications";
    } else if (type === "resources") {
      redirectPath = "/learning"; // fallback
      try {
        const listRes = await fetch(`/api/pages/${type}`);
        if (listRes.ok) {
          const data = await listRes.json();
          const pages = Array.isArray(data?.pages) ? data.pages : [];
          const currentIndex = pages.findIndex((p) => p.slug === slug);
          if (currentIndex > 0) {
            const previousPage = pages[currentIndex - 1];
            if (previousPage?.slug) {
              redirectPath = getPagePath(type, previousPage.slug);
            }
          }
        }
      } catch {
        // Use fallback if fetch fails.
      }
    } else {
      redirectPath = getFallbackPath(type);
    }

    const res = await fetch(`/api/admin/pages/${type}/${slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(redirectPath);
      return;
    }

    const message = await res.text();
    alert(
      `Fehler beim Löschen (HTTP ${res.status}): ${message || "Unbekannter Fehler"}`
    );
  };

  if (useIsAdmin()) {
    return (
      <Row pb="xl" mt="2xl" justify="space-between">
        <Button
          onClick={() => {
            setActAs({ label: "Lehrer", value: "admin" });
            const query = view ? `?view=${view}` : "";
            router.push(`/admin/edit-page/${type}/${slug}${query}`);
          }}
        >
          Edit Page
        </Button>
        {pageExists && (
          <Row gap="sm">
            <Button
              onClick={handleReset}
              style={{
                background: "var(--tertiary1)",
                color: "var(--fg1)",
                border: "var(--tertiary5)",
                borderRadius: "5px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Zurücksetzen
            </Button>
            <Button
              onClick={handleDelete}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Löschen
            </Button>
          </Row>
        )}
      </Row>
    );
  }
  return <></>;
}
