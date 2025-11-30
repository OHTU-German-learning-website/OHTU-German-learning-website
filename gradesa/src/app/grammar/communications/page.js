"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/linkbutton";
import { useUser } from "@/context/user.context";
import "@/app/grammar/themes/lessons.css";

// 1. KEEP THE EARLIER CHAPTERS
// Import the static list from the sibling folder [chapter]
import { chapters as staticChapters } from "./[chapter]/page";

export default function CommunicationsChapter() {
  const { auth } = useUser();
  const [dbChapters, setDbChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH NEW CHAPTERS (AND FILTER DUPLICATES)
  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch("/api/list-communications");

        if (res.ok) {
          const data = await res.json();
          // Ensure we are working with an array
          const items = Array.isArray(data) ? data : [];

          // Create a list of the existing IDs (e.g., "1", "2", "3")
          // This prevents duplicates if a DB page has the same ID as a static one
          const existingIds = new Set((staticChapters || []).map((c) => c.id));

          // Only keep DB items that are NOT in the list
          const uniqueNewChapters = items
            .filter((item) => !existingIds.has(item.slug))
            .map((item) => ({
              id: item.slug,
              title: item.title,
              link: `/grammar/communications/${item.slug}`,
              isCustom: true, // Mark as custom so we know we can delete it
            }));

          setDbChapters(uniqueNewChapters);
        }
      } catch (error) {
        console.error("Failed to load chapters", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, []);

  // Delete Function
  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch("/api/admin/delete-page", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        // Reload the page to refresh the list
        window.location.reload();
      } else {
        alert("Failed to delete page");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 3. COMBINE LISTS
  // Static chapters first, then new database chapters
  const allChapters = [...(staticChapters || []), ...dbChapters];

  return (
    <div className="themes-title">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Kommunikationssituationen</h1>

        {/* Admin Button - Only show if logged in and Admin */}
        {auth.isLoggedIn && auth.user?.is_admin && (
          <LinkButton href="/grammar/communications/create-newpage">
            + Neue Seite erstellen
          </LinkButton>
        )}
      </div>

      <div className="lessons-container">
        {loading && <p>Laden...</p>}

        {allChapters.map((chapter) => (
          <div className="flex-parent-element" key={chapter.id || chapter.link}>
            <div
              className="flex-child-element"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* The Link to the Lesson */}
              <Link href={chapter.link} style={{ flex: 1 }}>
                {chapter.title}
              </Link>

              {/* Delete Button (Only for Admins AND Custom Pages) */}
              {auth.isLoggedIn && auth.user?.is_admin && chapter.isCustom && (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link click
                    handleDelete(chapter.id);
                  }}
                  style={{
                    marginLeft: "10px",
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Löschen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
