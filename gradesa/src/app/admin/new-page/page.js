"use client";
import { useState } from "react";
import { Column, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import layout from "@/shared/styles/layout.module.css";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const [type, setType] = useState("resources");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const router = useRouter();
  const submit = async () => {
    const response = await fetch(`/api/admin/pages/${type}/${slug}`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    if (response.ok) {
      router.push(`/admin/edit-page/${type}/${slug}`);
    } else {
      setTimeout(() => setCreationMessage(""), 1000);
      setCreationMessage("Slug already in use");
    }
  };
  return (
    <Column className={layout.viewContent}>
      <h1>New page</h1>
      {!!creationMessage && <p className="error-message">{creationMessage}</p>}
      <Row gap="1rem">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Row>
      <Row gap="1rem">
        <label htmlFor="title">Slug</label>
        <input
          type="text"
          id="title"
          value={slug}
          onInput={(e) => {
            setSlug(e.target.value.replace(/[^A-Za-z0-9\-\_\+]/g, ""));
          }}
          required
        />
      </Row>
      <Row>
        <label htmlFor="type">Page group</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="resources">Learning</option>
          <option value="grammar">Grammar</option>
          <option value="communications">Communication</option>
        </select>
      </Row>
      <Button onClick={submit}>Create</Button>
    </Column>
  );
}
