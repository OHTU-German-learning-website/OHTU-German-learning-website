"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/linkbutton";
import { useUser } from "@/context/user.context";
import { Column } from "@/components/ui/layout/container";

export default function ChapterList({ params }) {
  const { type } = use(params);
  const { auth } = useUser();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch ALL pages (1-16 and new ones) from database
        const res = await fetch(`/api/list-pages?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setChapters(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  const handleDelete = async (slug) => {
    if (
      !confirm("Wirklich löschen? Dies kann nicht rückgängig gemacht werden!")
    )
      return;
    await fetch("/api/admin/delete-page", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    window.location.reload();
  };

  const header =
    type === "resources"
      ? "Lernen"
      : type === "communications"
        ? "Kommunikationssituationen"
        : type;

  return (
    <Column gap="md">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{header}</h1>
        {auth.isLoggedIn && auth.user?.is_admin && (
          <LinkButton href={`/pages/${type}/create-newpage`}>
            + Neue Seite
          </LinkButton>
        )}
      </div>

      {loading && <p>Laden...</p>}

      {chapters.map((chapter) => {
        return (
          <div
            key={chapter.slug}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 0",
            }}
          >
            <Link href={`/pages/${type}/${chapter.slug}`} style={{ flex: 1 }}>
              {chapter.title}
            </Link>

            {/* DELETE BUTTON: For Admins, on EVERY page */}
            {auth.isLoggedIn && auth.user?.is_admin && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(chapter.slug);
                }}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  fontSize: "0.8rem",
                }}
              >
                Löschen
              </button>
            )}
          </div>
        );
      })}
    </Column>
  );
}
