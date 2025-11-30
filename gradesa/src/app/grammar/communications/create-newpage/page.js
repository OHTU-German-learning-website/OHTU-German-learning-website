"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Container } from "@/components/ui/layout/container";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";

// Import CSS for the editor
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateCommunicationsPage() {
  const router = useRouter();
  const { auth } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    page_order: 100,
    content: "",
  });

  // Security Check
  useEffect(() => {
    if (auth.isLoggedIn && !auth.user?.is_admin) {
      router.replace("/grammar/communications");
    }
  }, [auth, router]);

  if (!auth.isLoggedIn) return <p style={{ padding: "2rem" }}>Laden...</p>;
  if (!auth.user?.is_admin) return null;

  // Handlers
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const autoSlug = title
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({ ...prev, title: title, slug: autoSlug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/create-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          page_group: "communications",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect immediately on success
        router.push("/grammar/communications");
      } else {
        setMessage(`Fehler: ${data.error}`);
        setLoading(false);
      }
    } catch (error) {
      setMessage("Netzwerkfehler aufgetreten.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* DARK MODE STYLES FOR EDITOR */}
      <style jsx global>{`
        .ql-toolbar {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        .ql-stroke {
          stroke: #e2e8f0 !important;
        }
        .ql-fill {
          fill: #e2e8f0 !important;
        }
        .ql-picker {
          color: #e2e8f0 !important;
        }
        .ql-container {
          background-color: #0f172a !important;
          border-color: #334155 !important;
          color: white !important;
          font-size: 1.1rem;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: normal;
        }
      `}</style>

      <main className={styles.main}>
        <Container bg="var(--bg4)">
          <h1 style={{ marginBottom: "20px" }}>Neue Seite erstellen</h1>

          {message && (
            <div
              style={{
                padding: "10px",
                background: "#fee2e2",
                color: "#991b1b",
                marginBottom: "1rem",
                borderRadius: "5px",
              }}
            >
              {message}
            </div>
          )}

          {/* TOP ACTION BAR (Like Edit Page) */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: "10px 20px",
                background: "#334155", // Dark Grey
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#2563eb", // Blue
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "wait" : "pointer",
                fontWeight: "500",
              }}
            >
              {loading ? "Speichern..." : "Speichern"}
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Title */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Titel der Lektion
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="z.B. Im Restaurant bestellen"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  border: "1px solid #334155",
                  background: "#1e293b", // Dark Input
                  color: "white",
                }}
              />
            </div>

            {/* Hidden Slug & Order */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ width: "100px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "0.9rem",
                  }}
                >
                  Nummer
                </label>
                <input
                  type="number"
                  value={formData.page_order}
                  onChange={(e) =>
                    setFormData({ ...formData, page_order: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #334155",
                    background: "#1e293b",
                    color: "white",
                  }}
                />
              </div>
            </div>

            {/* Editor */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Inhalt
              </label>
              <div style={{ height: "400px", marginBottom: "50px" }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  style={{ height: "350px" }}
                  placeholder="Schreiben Sie hier den Inhalt..."
                />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
