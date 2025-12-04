"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import Editor from "@/components/ui/editor";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import layout from "@/shared/styles/layout.module.css";

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
    <Column className={layout.viewContent}>
      <Row gap="1rem">
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Close editor
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Save changes
        </Button>
      </Row>
      <Row gap="1rem">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          required
        />
      </Row>
      <Row gap="1rem">
        <label htmlFor="slug">Slug</label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onInput={(e) => {
            setFormData((p) => ({ ...p, slug: e.target.value }));
          }}
          required
        />
      </Row>
      <Row justify="space-between" pb="xl">
        <Editor
          defaultContent={formData.content}
          updateEditorContent={(content) => {
            setFormData((p) => ({ ...p, content }));
          }}
        />
      </Row>
    </Column>
  );
}
