"use client";

import { useState } from "react";
import { Column, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/editor";
import layout from "@/shared/styles/layout.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditorSection({
  initialContent,
  type,
  slug,
  title,
  page_order,
  pageExists,
}) {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [editorMessage, setEditorMessage] = useState({ error: false, msg: "" });
  const [titleInput, setTitleInput] = useState(title);
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  /**  After closing or saving the editor, return the user to the same grammar view
   * (topics or alphabetical) they came from. */
  const getViewPath = (type, slugValue) => {
    if (type === "grammar") {
      const query = view ? `?view=${view}` : "";
      return `/grammar/themes/${slugValue}${query}`;
    }
    return `/pages/${type}/${slugValue}`;
  };

  const submitEditorContent = async () => {
    // A naive approach with string replacement is used here.
    const jsonData = JSON.stringify({
      content: editorContent.replace(/&nbsp;/g, " "),
      title: titleInput,
    });

    if (!pageExists && type === "grammar") {
      const createRes = await fetch(`/api/admin/pages/${type}/${slug}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          title: titleInput,
        }),
      });

      if (!createRes.ok && createRes.status !== 200) {
        setEditorMessage({
          error: true,
          msg: "Fehler beim Erstellen der Seite.",
        });
        return;
      }
    }
    const res = await fetch(`/api/admin/pages/${type}/${slug}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: jsonData,
    });

    if (res.status == 200) {
      setEditorMessage({ error: false, msg: "Updated successfully" });
      router.push(getViewPath(type, slug));
    } else {
      const errorText = await res.text();
      setEditorMessage({
        error: true,
        msg: errorText || "Fehler beim Speichern.",
      });
    }
    setTimeout(() => setEditorMessage({ error: false, msg: "" }), 1000);
  };

  return (
    <Column className={layout.viewContent}>
      <Row gap="1rem">
        <Button
          onClick={() => {
            router.push(getViewPath(type, slug));
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
