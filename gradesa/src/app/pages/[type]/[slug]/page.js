"use client";
import { useState, useEffect, use } from "react";
import { LinkButton } from "@/components/ui/linkbutton";
import { Column, Container, Row } from "@/components/ui/layout/container";
import layout from "@/shared/styles/layout.module.css";
import RenderHTML from "@/components/ui/render-html/render-html";
import { useUser } from "@/context/user.context";
import EditButton from "./edit-button";

export default function PageViewer({ params }) {
  const { type, slug } = use(params);
  const { auth } = useUser();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        // FIX: We send '&type=' so the backend knows to ignore the "Resources" page
        const res = await fetch(
          `/api/content-by-slug?slug=${slug}&type=${type}`
        );
        if (res.ok) setPage(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug, type]);

  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Seite wirklich löschen?")) return;

    // FIX: Send page_group so we delete the correct row
    const res = await fetch("/api/admin/delete-page", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, page_group: type }),
    });

    if (res.ok) window.location.href = `/pages/${type}`;
    else alert("Fehler beim Löschen.");
  };

  if (loading) return <div style={{ padding: "2rem" }}>Laden...</div>;
  if (!page)
    return (
      <div style={{ padding: "2rem" }}>
        404 - Nicht gefunden{" "}
        <div style={{ marginTop: "1rem" }}>
          <LinkButton href={`/pages/${type}`}>Zurück</LinkButton>
        </div>
      </div>
    );

  return (
    <Column className={layout.viewContent}>
      {/* Buttons Header: Edit Left | Delete Right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <EditButton url={`/admin/edit-page/${type}/${slug}`} />

        {auth.isLoggedIn && auth.user?.is_admin && (
          <button
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
          </button>
        )}
      </div>

      <h1 style={{ marginBottom: "1rem" }}>{page.title}</h1>

      {/* Render content safely */}
      {page.content && page.content.includes("<") ? (
        <div
          className="ql-editor"
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <RenderHTML data={page.content} />
      )}

      <div style={{ marginTop: "2rem" }}>
        <LinkButton href={`/pages/${type}`}>Zurück</LinkButton>
      </div>
    </Column>
  );
}
