"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
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
  const makeRequest = useRequest();
  const router = useRouter();

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

      const res = await makeRequest("/admin/glossary", {
        method: "POST",
        body: { word, word_definition: wordDefinition },
      });

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

  return (
    <Column gap="md">
      <h2>Glossar-Eintrag erstellen</h2>
      <p>Fügen Sie einen neuen Wort-Definition-Paar zum Glossar hinzu.</p>
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
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </Button>
      </Row>
    </Column>
  );
}
