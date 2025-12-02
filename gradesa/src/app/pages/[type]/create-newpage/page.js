"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Container } from "@/components/ui/layout/container";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreatePage({ params }) {
  const { type } = use(params);
  const router = useRouter();
  const { auth } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    page_order: 100,
    content: "",
  });

  useEffect(() => {
    if (auth.isLoggedIn && !auth.user?.is_admin)
      router.replace(`/pages/${type}`);
  }, [auth, router, type]);
  if (!auth.isLoggedIn || !auth.user?.is_admin) return null;

  const handleTitleChange = (e) => {
    const title = e.target.value;
    // Basic slug generation
    const match = title.match(/^\d+/);
    const slug = match
      ? match[0]
      : title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, "")
          .replace(/\s+/g, "-");
    setFormData((p) => ({ ...p, title, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/create-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, page_group: type }),
    });
    if (res.ok) router.push(`/pages/${type}`);
    else {
      alert("Fehler beim Speichern");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <style jsx global>{`
        .ql-toolbar {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }
        .ql-container {
          background-color: #0f172a !important;
          border-color: #334155 !important;
          color: white !important;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
        }
      `}</style>
      <main className={styles.main}>
        <Container bg="var(--bg4)">
          <h1 style={{ marginBottom: "20px" }}>
            Neue Seite erstellen ({type})
          </h1>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: "10px 20px",
                background: "#334155",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Speichern
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Slug (ID)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Inhalt
              </label>
              <div style={{ height: "400px", marginBottom: "50px" }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, content: val }))
                  }
                  style={{ height: "350px" }}
                />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
