"use client";

import { checkUseIsAdmin } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Row } from "@/components/ui/layout/container";

export default function AdminButtons({ type, slug }) {
  const { setActAs } = useUser();
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Seite wirklich löschen?")) return;
    const res = await fetch(`/api/admin/pages/${type}/${slug}`, {
      method: "DELETE",
    });

    if (res.ok) window.location.href = `/pages/${type}`;
    else alert("Fehler beim Löschen.");
  };

  if (checkUseIsAdmin()) {
    return (
      <Row pb="xl" justify="space-between">
        <Button
          onClick={() => {
            setActAs({ label: "Lehrer", value: "admin" });
            router.push(`/admin/edit-page/${type}/${slug}`);
          }}
        >
          Edit Page
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
    );
  }
  return <></>;
}
