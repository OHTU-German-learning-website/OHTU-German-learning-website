"use client";
import styles from "../../../page.module.css";
import "./admin.css";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
import PreviewDragDrop from "@/components/ui/dragdrop/dragdrop_preview";

export default function DragdropAdminPage() {
  const [numberOfFields, setNumberOfFields] = useState(null);
  const [inputFields, setInputFields] = useState([]);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const makeRequest = useRequest();
  const router = useRouter();

  useEffect(() => {
    if (numberOfFields) {
      if (numberOfFields > inputFields.length) {
        const additionalFields = Array(numberOfFields - inputFields.length)
          .fill("")
          .map(() => ({
            color: "",
            category: "",
            content: "",
          }));
        setInputFields([...inputFields, ...additionalFields]);
      } else {
        setInputFields(inputFields.slice(0, numberOfFields));
      }
    }
  }, [numberOfFields]);

  const handleInputChange = (index, field, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = {
      ...newInputFields[index],
      [field]: value,
    };
    setInputFields(newInputFields);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");

      const res = await makeRequest("/admin/exercises/dragdrop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the content type is set
        },
        body: {
          title: title.trim(),
          fields: inputFields,
        },
      });

      if (res.status === 200) {
        router.push("/admin/create-exercise");
      }
    } catch (e) {
      console.error("Error creating dragdrop exercise:", e);

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

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleCancel = () => {
    router.push("/admin/create-exercise");
  };

  return (
    <div className={styles.page}>
      <div className="admin-container">
        <h1>Eine Drag-and-Drop-Übung erstellen</h1>
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
                    placeholder={`Wörter eingeben`}
                  />
                </div>
              ))}
          </Row>
          <div className="button-group">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !title.trim() ||
                !numberOfFields ||
                inputFields.some(
                  (field) => !field.color || !field.category || !field.content
                )
              }
            >
              {isSubmitting ? "Wird erstellt..." : "Erstellen"}
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
