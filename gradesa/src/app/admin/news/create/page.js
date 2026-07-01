"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState, useEffect } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter, useSearchParams } from "next/navigation";
import Editor from "@/components/ui/editor";
import { withBasePath } from "@/shared/utils/basePath";
import AdminLastModified from "@/components/ui/admin-last-modified";

const defaultFormErrors = {
  title: "",
  content: "",
};

export default function CreateNewsArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTeacherOnly, setIsTeacherOnly] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState(defaultFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [lastModifiedAt, setLastModifiedAt] = useState(null);
  const [lastModifiedBy, setLastModifiedBy] = useState(null);
  const makeRequest = useRequest();
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const isEditing = Boolean(articleId);

  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      try {
        setIsLoadingArticle(true);
        const response = await fetch(
          withBasePath(`/api/admin/news?id=${articleId}`)
        );
        if (!response.ok) {
          throw new Error("Failed to load news article");
        }
        const article = await response.json();
        if (article.error) {
          throw new Error(article.error);
        }
        setTitle(article.title);
        setContent(article.content);
        setIsTeacherOnly(article.is_teacher_only || false);
        setLastModifiedAt(article.updated_at || null);
        setLastModifiedBy(article.updated_by || null);
      } catch (error) {
        console.error("Error loading news article:", error);
        setGeneralError("Nachricht konnte nicht geladen werden.");
      } finally {
        setIsLoadingArticle(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);

    // Clear title error when user starts typing
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");
      setFormErrors(defaultFormErrors);

      // Validate
      const errors = { ...defaultFormErrors };
      if (!title.trim()) {
        errors.title = "Titel ist erforderlich";
      }
      if (!content.trim()) {
        errors.content = "Inhalt ist erforderlich";
      }

      if (Object.values(errors).some((e) => e)) {
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      const method = isEditing ? "PUT" : "POST";
      const url = "/admin/news";

      const requestData = isEditing
        ? { id: articleId, title, content, is_teacher_only: isTeacherOnly }
        : { title, content, is_teacher_only: isTeacherOnly };

      const res = await makeRequest(url, requestData, { method });

      if (res.status === 200 || res.status === 201) {
        router.push("/admin/news");
      }
    } catch (e) {
      console.error("Submission error:", e);
      if (e.response?.data?.error) {
        setGeneralError(e.response.data.error);
      } else {
        setGeneralError("Ein Fehler ist aufgetreten");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/news");
  };

  if (isEditing && isLoadingArticle) {
    return <p>Lädt Nachricht...</p>;
  }

  return (
    <Column gap="md">
      <h2>{isEditing ? "Nachricht bearbeiten" : "Nachricht erstellen"}</h2>
      {isEditing && (
        <AdminLastModified
          updatedAt={lastModifiedAt}
          updatedBy={lastModifiedBy}
        />
      )}
      <p>
        {isEditing
          ? "Aktualisieren Sie die ausgewählte Nachricht."
          : "Erstellen Sie eine neue Nachricht für die Startseite."}
      </p>
      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}
      <label>
        Titel
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Geben Sie hier den Titel ein"
          className={formErrors.title ? "error-input" : ""}
        />
        {formErrors.title && <p className="error">{formErrors.title}</p>}
      </label>
      <Column gap="sm">
        <label htmlFor="content">Inhalt</label>
        <Editor
          defaultContent={content}
          updateEditorContent={(newContent) => {
            setContent(newContent);
            if (formErrors.content) {
              setFormErrors((prev) => ({ ...prev, content: "" }));
            }
          }}
        />
        {formErrors.content && <p className="error">{formErrors.content}</p>}
      </Column>
      <label className="teacher-only-toggle">
        <input
          type="checkbox"
          checked={isTeacherOnly}
          onChange={(e) => setIsTeacherOnly(e.target.checked)}
        />
        <span>Nur für Lehrer sichtbar</span>
      </label>
      <Row
        justify={"space-between"}
        align="center"
        wrap="wrap"
        gap="md"
        mt={"xl"}
        mb={"xl"}
      >
        <Button variant="outline" onClick={handleCancel}>
          Abbrechen
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Speichern..."
              : "Wird gesendet..."
            : isEditing
              ? "Speichern"
              : "Absenden"}
        </Button>
      </Row>
    </Column>
  );
}
