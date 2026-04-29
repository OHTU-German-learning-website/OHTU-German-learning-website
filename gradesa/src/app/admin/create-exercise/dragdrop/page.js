"use client";
import styles from "../../../page.module.css";
import "./admin.css";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
import { useRequest } from "@/shared/hooks/useRequest";
import { useParams, useRouter } from "next/navigation";
import useQuery from "@/shared/hooks/useQuery";
import PreviewDragDrop from "@/components/ui/dragdrop/dragdrop_preview";

export default function DragdropAdminPage() {
  const { dnd_id } = useParams();
  const isEditMode = Boolean(dnd_id);
  const [numberOfFields, setNumberOfFields] = useState(null);
  const [inputFields, setInputFields] = useState([]);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const makeRequest = useRequest();
  const router = useRouter();
  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    error: exerciseError,
  } = useQuery(`/admin/exercises/dragdrop/${dnd_id || ""}`, null, {
    enabled: isEditMode,
  });

  const parseWords = (content) =>
    content
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);

  useEffect(() => {
    if (!numberOfFields) return;

    setInputFields((prevFields) => {
      if (numberOfFields > prevFields.length) {
        const additionalFields = Array(numberOfFields - prevFields.length)
          .fill("")
          .map(() => ({
            color: "",
            category: "",
            content: "",
          }));

        return [...prevFields, ...additionalFields];
      }

      return prevFields.slice(0, numberOfFields);
    });
  }, [numberOfFields]);

  useEffect(() => {
    if (!isEditMode || !exerciseData) return;

    setTitle(exerciseData.title || "");
    setInputFields(
      Array.isArray(exerciseData.fields) ? exerciseData.fields : []
    );
    setNumberOfFields(
      Array.isArray(exerciseData.fields) ? exerciseData.fields.length : null
    );
  }, [exerciseData, isEditMode]);

  const handleInputChange = (index, field, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = {
      ...newInputFields[index],
      [field]: value,
    };
    setInputFields(newInputFields);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    try {
      setIsSubmitting(true);
      setGeneralError("");

      if (isEditMode) {
        const response = await fetch(
          `/api/admin/exercises/dragdrop/${dnd_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title.trim(),
              fields: inputFields,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Fehler beim Speichern der Übung.");
        }
      } else {
        const res = await makeRequest("/admin/exercises/dragdrop", {
          title: title.trim(),
          fields: inputFields,
        });

        if (res.status !== 200) {
          throw new Error("Fehler beim Erstellen der Übung.");
        }

        const createdDndId = res?.data?.dndId;
        if (!createdDndId) {
          throw new Error("Übung wurde erstellt, aber die ID fehlt.");
        }

        router.push(`/grammar/exercises/dragdrop/${createdDndId}`);
        return;
      }

      router.push("/grammar/exercises/dragdrop");
    } catch (e) {
      console.error("Error creating Sortieren/Gruppieren exercise:", e);
      setGeneralError(
        e?.response?.data?.error || e.message || "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleCancel = () => {
    router.push("/admin/create-exercise");
  };

  if (isEditMode && isExerciseLoading) {
    return <div>Übung wird geladen...</div>;
  }

  if (isEditMode && exerciseError) {
    return <div>{exerciseError.message || "Fehler beim Laden der Übung."}</div>;
  }

  return (
    <div className={styles.page}>
      <div className="admin-container">
        <h1>
          {isEditMode
            ? "Eine Sortieren/Gruppieren-Übung bearbeiten"
            : "Eine Sortieren/Gruppieren-Übung erstellen"}
        </h1>
        {generalError && (
          <p className="error" role="alert">
            {generalError}
          </p>
        )}
        {showPreview && (
          <div className="preview-modal">
            <PreviewDragDrop title={title} fields={inputFields} />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setShowPreview(false)}
            >
              Vorschau schließen
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titel:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Titel eingeben"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fieldCount">Anzahl der Felder</label>
            <Dropdown
              options={[
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
              onSelect={(selectedOption) =>
                setNumberOfFields(Number(selectedOption.value))
              }
            >
              <Button size="md" variant="outline" width="fit">
                {numberOfFields
                  ? `Ausgewählte Anzahl: ${numberOfFields}`
                  : "Anzahl der Felder"}
              </Button>
            </Dropdown>
          </div>
          <Row gap="md">
            {numberOfFields &&
              inputFields.map((field, index) => (
                <div key={index} className="form-group">
                  <Row gap="md">
                    <Dropdown
                      options={[
                        {
                          label: "Rot",
                          value: "red",
                          style: {
                            backgroundColor: "var(--red)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Blau",
                          value: "blue",
                          style: {
                            backgroundColor: "var(--blue)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Grün",
                          value: "green",
                          style: {
                            backgroundColor: "var(--green)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Gelb",
                          value: "yellow",
                          style: {
                            backgroundColor: "var(--yellow)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Lila",
                          value: "purple",
                          style: {
                            backgroundColor: "var(--purple)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                      ]}
                      onSelect={(selectedOption) =>
                        handleInputChange(index, "color", selectedOption.value)
                      }
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        style={
                          field.color
                            ? {
                                backgroundColor: `var(--${field.color})`,
                                transition: "background-color 0.2s",
                              }
                            : {}
                        }
                      >
                        {field.color || "Farbe"}
                      </Button>
                    </Dropdown>
                    <input
                      type="text"
                      value={field.category}
                      onChange={(e) =>
                        handleInputChange(index, "category", e.target.value)
                      }
                      className="form-input"
                      placeholder={`Kategorie ${index + 1} eingeben`}
                    />
                  </Row>
                  <input
                    type="text"
                    value={field.content}
                    onChange={(e) =>
                      handleInputChange(index, "content", e.target.value)
                    }
                    className="form-input"
                    placeholder={`Woerter eingeben (z.B. gehen, laufen, sprechen)`}
                  />
                  <small>Mehrere Woerter pro Box: mit Komma trennen.</small>
                </div>
              ))}
          </Row>
          <div className="button-group">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={
                isSubmitting ||
                !title.trim() ||
                !numberOfFields ||
                inputFields.some(
                  (field) =>
                    !field.color ||
                    !field.category ||
                    parseWords(field.content).length === 0
                )
              }
            >
              {isSubmitting
                ? isEditMode
                  ? "Wird gespeichert..."
                  : "Wird erstellt..."
                : isEditMode
                  ? "Speichern"
                  : "Erstellen"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handlePreview}
              disabled={
                !title.trim() ||
                !numberOfFields ||
                inputFields.some(
                  (field) => !field.color || !field.category || !field.content
                )
              }
            >
              Vorschau
            </Button>
            <Button
              type="button"
              size="sm"
              variant="tertiary"
              onClick={handleCancel}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
