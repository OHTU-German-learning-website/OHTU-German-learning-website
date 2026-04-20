"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState, useEffect } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter, useSearchParams } from "next/navigation";
import { zodErrorToFormErrors } from "@/shared/schemas/schema-utils";

const defaultFormErrors = {
  word: "",
  word_definition: "",
};

export default function CreateGlossaryEntry() {
  const [word, setWord] = useState("");
  const [wordDefinition, setWordDefinition] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState(defaultFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const makeRequest = useRequest();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get("id");
  const isEditing = Boolean(entryId);

  useEffect(() => {
    if (!entryId) return;

    const loadEntry = async () => {
      try {
        setIsLoadingEntry(true);
        const response = await fetch(`/api/admin/glossary?id=${entryId}`);
        if (!response.ok) {
          throw new Error("Failed to load glossary entry");
        }
        const entry = await response.json();
        setWord(entry.word);
        setWordDefinition(entry.word_definition);
      } catch (error) {
        console.error("Error loading glossary entry:", error);
        setGeneralError("Glossar-Eintrag konnte nicht geladen werden.");
      } finally {
        setIsLoadingEntry(false);
      }
    };

    loadEntry();
  }, [entryId]);

  const handleWordChange = (e) => {
    const val = e.target.value;
    setWord(val);

    // Clear word error when user starts typing
    if (formErrors.word) {
      setFormErrors((prev) => ({ ...prev, word: "" }));
    }
  };

  const handleDefinitionChange = (e) => {
    const val = e.target.value;
    setWordDefinition(val);

    // Clear definition error when user starts typing
    if (formErrors.word_definition) {
      setFormErrors((prev) => ({ ...prev, word_definition: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");
      setFormErrors(defaultFormErrors);

      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing
        ? `/admin/glossary?id=${entryId}`
        : "/admin/glossary";

      const res = await makeRequest(
        url,
        { word, word_definition: wordDefinition },
        { method }
      );

      if (res.status === 200) {
        router.push("/admin/glossary");
      }
    } catch (e) {
      console.error("Submission error:", e);
      if (e.response?.data?.error) {
        setGeneralError(e.response.data.error);
      } else {
        setGeneralError("Ein Fehler ist aufgetreten");
      }

      if (e.response?.status === 422) {
        try {
          const zodErrors = e.response?.data?.zodError;
          const newErrors = zodErrorToFormErrors(zodErrors, formErrors);
          setFormErrors(newErrors);
        } catch (parseError) {
          console.error("Error parsing validation results:", parseError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/glossary");
  };

  if (isEditing && isLoadingEntry) {
    return <p>Lädt Glossar-Eintrag...</p>;
  }

  return (
    <Column gap="md">
      <h2>
        {isEditing ? "Glossar-Eintrag bearbeiten" : "Glossar-Eintrag erstellen"}
      </h2>
      <p>
        {isEditing
          ? "Aktualisieren Sie den ausgewählten Glossar-Eintrag."
          : "Fügen Sie einen neuen Wort-Definition-Paar zum Glossar hinzu."}
      </p>
      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}
      <label>
        Wort
        <input
          type="text"
          value={word}
          onChange={handleWordChange}
          placeholder="Geben Sie hier das Wort ein"
          className={formErrors.word ? "error-input" : ""}
        />
        {formErrors.word && <p className="error">{formErrors.word}</p>}
      </label>
      <label>
        Definition
        <textarea
          value={wordDefinition}
          onChange={handleDefinitionChange}
          placeholder="Geben Sie hier die Definition ein"
          className={formErrors.word_definition ? "error-input" : ""}
        />
        {formErrors.word_definition && (
          <p className="error">{formErrors.word_definition}</p>
        )}
      </label>
      <Row justify={"space-between"} gap="md" mt={"xl"} mb={"xl"}>
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
