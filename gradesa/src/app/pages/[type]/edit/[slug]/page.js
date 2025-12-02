"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import { Container } from "@/components/ui/layout/container";
import styles from "@/app/page.module.css";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditPage({ params }) {
  const { type, slug } = use(params);
  const router = useRouter();
  const { auth } = useUser();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    page_order: 100,
    content: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        // FIX: Fetch the correct page by type
        const res = await window.fetch(
          `/api/content-by-slug?slug=${slug}&type=${type}`
        );
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title,
            slug: slug,
            page_order: 100,
            content: data.content || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, type]);

  const handleSubmit = async () => {
    const res = await window.fetch("/api/admin/edit-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // FIX: Send page_group to update the correct row
      body: JSON.stringify({
        originalSlug: slug,
        page_group: type,
        ...formData,
      }),
    });
    if (res.ok) router.push(`/pages/${type}/${slug}`);
    else alert("Fehler beim Speichern");
  };

  if (loading) return <p style={{ padding: "2rem" }}>Laden...</p>;
  if (!auth.isLoggedIn || !auth.user?.is_admin) return <p>Forbidden</p>;

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
      `}</style>
      <main className={styles.main}>
        <Container bg="var(--bg4)">
          <h1 style={{ marginBottom: "20px" }}>Seite bearbeiten</h1>
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
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "white",
                }}
              />
            </div>
            <div>
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
