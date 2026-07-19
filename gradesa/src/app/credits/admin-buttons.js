"use client";

import { useUser } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Row } from "@/components/ui/layout/container";
import { useSearchParams } from "next/navigation";
import { withBasePath } from "@/shared/utils/basePath";
import { getDeleteErrorMessage } from "@/shared/utils/deleteErrorMessage";

export default function AdminButtons({ type, slug, pageExists = true }) {
  const { auth } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  // Check if user is superadmin without causing redirects
  const isSuperAdmin = auth?.isLoggedIn && auth?.user?.is_superadmin;

  /** Reset: empties the page content but keeps the page row. */
  const handleReset = async () => {
    if (!confirm("Möchten Sie den Inhalt dieser Seite wirklich leeren?"))
      return;
    const res = await fetch(withBasePath(`/api/admin/pages/${type}/${slug}`), {
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

  /** Delete: removes the whole page row from the database. */
  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Seite wirklich endgültig löschen?")) return;

    const res = await fetch(withBasePath(`/api/admin/pages/${type}/${slug}`), {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/"); // Redirect to home page
      return;
    }

    const message = await getDeleteErrorMessage(res, "Fehler beim Löschen.");
    alert(message);
  };

  if (isSuperAdmin) {
    return (
      <Row pb="xl" mt="2xl" justify="space-between">
        <Button
          onClick={() => {
            router.push(
              `/admin/edit-page/${type}/${slug}${view ? `?view=${view}` : ""}`
            );
          }}
        >
          Seite bearbeiten
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
