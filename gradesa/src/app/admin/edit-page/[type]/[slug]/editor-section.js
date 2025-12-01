"use client";

import { useState } from "react";
import { Column, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/editor";
import layout from "@/shared/styles/layout.module.css";
import { useUser } from "@/context/user.context";
import { useRouter } from "next/navigation";

export default function EditorSection({
  initialContent,
  type,
  slug,
  title,
  page_order,
}) {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [editorMessage, setEditorMessage] = useState({ error: false, msg: "" });
  const [titleInput, setTitleInput] = useState(title);
  const [slugInput, setSlugInput] = useState(slug);
  const { setActAs } = useUser();
  const router = useRouter();

  const submitEditorContent = async () => {
    // A naive approach with string replacement is used here.
    const jsonData = JSON.stringify({
      content: editorContent.replace(/&nbsp;/g, " "),
      title: titleInput,
      slug: slugInput,
    });
    const res = await fetch(`/api/html-content/${type}/${slug}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: jsonData,
    });
    if (res.status == 200) {
      setEditorMessage({ error: false, msg: "Updated successfully" });
      router.push(`/admin/edit-page/${type}/${slugInput}`);
    } else {
      setEditorMessage({ error: true, msg: res.text() });
    }
    setTimeout(() => setEditorMessage({ error: false, content: "" }), 1000);
  };

  return (
    <Column className={layout.viewContent}>
      <Row gap="1rem">
        <Button
          onClick={() => {
            setActAs({ label: "Student", value: "user" });
            router.push(`/pages/${type}/${slug}`);
          }}
        >
          Close editor
        </Button>
        <Button onClick={submitEditorContent}>Save changes</Button>
      </Row>
      {!!editorMessage.msg &&
        (editorMessage.error ? (
          <p className="error-message">{editorMessage.msg}</p>
        ) : (
          <p className="success-message">{editorMessage.msg}</p>
        ))}
      <Row gap="1rem">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          required
        />
      </Row>
      <Row gap="1rem">
        <label htmlFor="title">Slug</label>
        <input
          type="text"
          id="title"
          value={slugInput}
          onInput={(e) => {
            setSlugInput(e.target.value.replace(/[^A-Za-z0-9\-\_\+]/g, ""));
          }}
          required
        />
      </Row>
      <Row justify="space-between" pb="xl">
        <Editor
          defaultContent={editorContent}
          updateEditorContent={(content) => {
            setEditorContent(content);
          }}
        />
      </Row>
    </Column>
  );
}
