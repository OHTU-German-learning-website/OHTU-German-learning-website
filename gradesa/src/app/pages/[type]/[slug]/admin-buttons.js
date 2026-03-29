"use client";

import { checkUseIsAdmin } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Row } from "@/components/ui/layout/container";
import { useSearchParams } from "next/navigation";

export default function AdminButtons({ type, slug, pageExists = true }) {
  const { setActAs } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  /**  Deleting a page should keep the user on the same route.
   *  After reload, the page falls back to the "no content" state. */
  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Seite wirklich löschen?")) return;
    const res = await fetch(`/api/admin/pages/${type}/${slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Fehler beim Löschen.");
    }
  };

  if (checkUseIsAdmin()) {
    return (
      <Row pb="xl" justify="space-between">
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
        )}
      </Row>
    );
  }
  return <></>;
}
