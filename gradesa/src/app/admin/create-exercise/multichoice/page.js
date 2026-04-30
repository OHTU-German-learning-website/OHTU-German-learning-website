"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";
import "./multichoice.css";

export default function CreateMultichoicePage() {
  const router = useRouter();
  const { exercise_id } = useParams();
  const isEditMode = Boolean(exercise_id);

  const [title, setTitle] = useState("");

  const [sections, setSections] = useState([
    { id: "1", type: "text", value: "Ich" },
    { id: "2", type: "text", value: "bin" },
    {
      id: "3",
      type: "multichoice",
      options: ["ein", "einer", "eine"],
      correct: 0,
    },
    { id: "4", type: "text", value: "Berliner" },
  ]);

  // Which section is currently being edited? (Index of the section)
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState(false);

  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    error: exerciseError,
  } = useQuery(`/admin/exercises/multichoice/${exercise_id || ""}`, null, {
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode || !exerciseData) {
      return;
    }

    setTitle(exerciseData.title || "");

    const mappedSections = (exerciseData.content || []).map((item) => {
      if (item.content_type === "multichoice") {
        const options = Array.isArray(item.options) ? item.options : [];
        const correctIndex = options.findIndex(
          (option) => option === item.correct_answer
        );

        return {
          id: String(item.id || crypto.randomUUID()),
          type: "multichoice",
          options: options.length > 0 ? options : ["Option 1", "Option 2"],
          correct: correctIndex >= 0 ? correctIndex : 0,
        };
      }

      if (item.content_type === "gap") {
        return {
          id: String(item.id || crypto.randomUUID()),
          type: "gap",
          value: item.content_value || "___",
          correct: item.correct_answer || "",
        };
      }

      if (item.content_type === "linebreak") {
        return {
          id: String(item.id || crypto.randomUUID()),
          type: "linebreak",
        };
      }

      return {
        id: String(item.id || crypto.randomUUID()),
        type: "text",
        value: item.content_value || "",
      };
    });

    setSections(mappedSections);
    setActiveSectionIndex(null);
  }, [exerciseData, isEditMode]);

  // --- Actions ---

  const insertSection = (newSection, { selectInserted = false } = {}) => {
    const insertIndex =
      activeSectionIndex === null ? sections.length : activeSectionIndex + 1;
    const newSections = [...sections];
    newSections.splice(insertIndex, 0, newSection);
    setSections(newSections);

    if (selectInserted) {
      setActiveSectionIndex(insertIndex);
    }
  };

  const addTextSection = () => {
    insertSection({ id: crypto.randomUUID(), type: "text", value: "" });
  };

  const addMultiChoiceSection = () => {
    insertSection(
      {
        id: crypto.randomUUID(),
        type: "multichoice",
        options: ["Option 1", "Option 2"],
        correct: 0, // Index of the correct answer
      },
      { selectInserted: true }
    );
  };

  const addGapSection = () => {
    insertSection(
      {
        id: crypto.randomUUID(),
        type: "gap",
        value: "___",
        correct: "",
      },
      { selectInserted: true }
    );
  };

  const addLineBreakSection = () => {
    insertSection({ id: crypto.randomUUID(), type: "linebreak" });
  };

  const handleTextChange = (index, newValue) => {
    const newSections = [...sections];
    newSections[index].value = newValue;
    setSections(newSections);
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
      return;
    }
    if (activeSectionIndex !== null && activeSectionIndex > index) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };

  // --- Backend Submission ---

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      setTitleError(false);

      // --- FIX 1: Convert Index to Text for correct answer ---
      const contentToSave = sections.map((section) => {
        if (section.type === "multichoice") {
          return {
            ...section,
            correct: section.options[section.correct],
          };
        }
        return section;
      });

      const endpoint = isEditMode
        ? `/api/admin/exercises/multichoice/${exercise_id}`
        : "/api/admin/exercises/multichoice";

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          // --- FIX 2: REMOVED description from here ---
          content: contentToSave,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) setTitleError(true);
        throw new Error(data.error || "Fehler beim Speichern");
      }

      router.push("/grammar/exercises/multichoice");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isExerciseLoading) {
    return <div className="admin-container">Lädt...</div>;
  }

  if (isEditMode && exerciseError) {
    return (
      <div className="admin-container">
        Fehler: {exerciseError.error || exerciseError.message || "Unbekannt"}
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>
        {isEditMode
          ? "Multiple Choice Übung bearbeiten"
          : "Multiple Choice Übung erstellen"}
      </h1>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Titel</label>
        <input
          className={`form-input${titleError ? " input-error" : ""}`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(false);
          }}
          placeholder="Titel der Übung"
        />
        {titleError && (
          <span className="field-error-hint">
            Dieser Titel existiert bereits. Bitte wähle einen anderen.
          </span>
        )}
      </div>
      <hr className="divider" />

      {/* --- The Sentence Builder (Inline Flow) --- */}
      <div className="sentence-builder-container">
        <h3>Satz bauen:</h3>
        <p className="builder-hint">
          Neue Elemente werden nach dem markierten Abschnitt eingefügt. Ohne
          Auswahl werden sie am Ende angehängt.
        </p>
        {activeSectionIndex !== null && (
          <button
            type="button"
            className="clear-selection-button"
            onClick={() => setActiveSectionIndex(null)}
          >
            Auswahl aufheben und am Ende einfügen
          </button>
        )}
        <div className="sentence-flow">
          {sections.map((section, index) => {
            if (section.type === "text") {
              return (
                <div
                  key={section.id}
                  className={`inline-block-wrapper ${
                    activeSectionIndex === index ? "active" : ""
                  }`}
                >
                  <input
                    type="text"
                    value={section.value}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    onFocus={() => setActiveSectionIndex(index)}
                    onClick={() => setActiveSectionIndex(index)}
                    className="text-block-input"
                    placeholder="..."
                  />
                  <button
                    onClick={() => removeSection(index)}
                    className="delete-x"
                  >
                    ×
                  </button>
                </div>
              );
            }
            if (section.type === "linebreak") {
              return (
                <div
                  key={section.id}
                  className={`inline-block-wrapper linebreak-block ${
                    activeSectionIndex === index ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex(index)}
                    className={`linebreak-button ${
                      activeSectionIndex === index ? "active" : ""
                    }`}
                  >
                    <span className="linebreak-indicator">↵</span>
                  </button>
                  <button
                    onClick={() => removeSection(index)}
                    className="delete-x"
                  >
                    ×
                  </button>
                </div>
              );
            }
            if (section.type === "gap") {
              const isActive = activeSectionIndex === index;

              return (
                <div
                  key={section.id}
                  className={`inline-block-wrapper ${isActive ? "active" : ""}`}
                >
                  <button
                    onClick={() => setActiveSectionIndex(index)}
                    className={`dropdown-placeholder ${isActive ? "active" : ""}`}
                  >
                    {section.correct || "Lücke"}
                  </button>
                  <button
                    onClick={() => removeSection(index)}
                    className="delete-x"
                  >
                    ×
                  </button>
                </div>
              );
            }
            // Multichoice Block
            const isActive = activeSectionIndex === index;
            return (
              <div
                key={section.id}
                className={`inline-block-wrapper ${isActive ? "active" : ""}`}
              >
                <button
                  onClick={() => setActiveSectionIndex(index)}
                  className={`dropdown-placeholder ${isActive ? "active" : ""}`}
                >
                  {/* Show the Correct Answer or "Dropdown" if empty */}
                  {section.options[section.correct] || "Dropdown"}
                  <span className="icon">▼</span>
                </button>
                <button
                  onClick={() => removeSection(index)}
                  className="delete-x"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* --- Buttons to add new parts --- */}
        <div className="action-row">
          <Button size="sm" width="fit" onClick={addTextSection}>
            + Text
          </Button>
          <Button size="sm" width="fit" onClick={addMultiChoiceSection}>
            + Auswahl
          </Button>
          <Button size="sm" width="fit" onClick={addGapSection}>
            + Lücke
          </Button>
          <Button size="sm" width="fit" onClick={addLineBreakSection}>
            + Zeilenumbruch
          </Button>
        </div>
      </div>

      {activeSectionIndex !== null &&
        sections[activeSectionIndex] &&
        sections[activeSectionIndex].type === "gap" && (
          <div className="dropdown-editor-panel">
            <h3>Lücke bearbeiten</h3>
            <p className="hint">
              Gib die korrekte Antwort für diese Lücke ein.
            </p>

            <div className="form-group">
              <label>Korrekte Antwort</label>
              <input
                type="text"
                value={sections[activeSectionIndex].correct}
                onChange={(e) => {
                  const newSections = [...sections];
                  newSections[activeSectionIndex].correct = e.target.value;
                  setSections(newSections);
                }}
                className="form-input"
                placeholder="Korrekte Antwort"
              />
            </div>
          </div>
        )}
      {/* --- Dropdown Editor (Only shows if a dropdown is clicked) --- */}
      {activeSectionIndex !== null &&
        sections[activeSectionIndex] &&
        sections[activeSectionIndex].type === "multichoice" && (
          <div className="dropdown-editor-panel">
            <h3>Optionen bearbeiten</h3>
            <p className="hint">
              Wähle den Radio-Button für die richtige Antwort.
            </p>

            {sections[activeSectionIndex].options.map((opt, optIndex) => (
              <div key={optIndex} className="option-row">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={sections[activeSectionIndex].correct === optIndex}
                  onChange={() => {
                    const newSections = [...sections];
                    newSections[activeSectionIndex].correct = optIndex;
                    setSections(newSections);
                  }}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[activeSectionIndex].options[optIndex] =
                      e.target.value;
                    setSections(newSections);
                  }}
                  className="form-input option-input"
                />
                <button
                  className="delete-btn"
                  onClick={() => {
                    const newSections = [...sections];
                    newSections[activeSectionIndex].options = newSections[
                      activeSectionIndex
                    ].options.filter((_, i) => i !== optIndex);
                    // Reset correct index if needed
                    if (newSections[activeSectionIndex].correct >= optIndex) {
                      newSections[activeSectionIndex].correct = 0;
                    }
                    setSections(newSections);
                  }}
                >
                  🗑
                </button>
              </div>
            ))}

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const newSections = [...sections];
                newSections[activeSectionIndex].options.push(
                  `Option ${newSections[activeSectionIndex].options.length + 1}`
                );
                setSections(newSections);
              }}
            >
              + Weitere Option
            </Button>
          </div>
        )}

      <hr className="divider" />

      {/* --- Main Action Buttons --- */}
      <div className="main-actions">
        <Button onClick={handleSubmit} disabled={isSubmitting || !title}>
          {isSubmitting
            ? "Speichern..."
            : isEditMode
              ? "Änderungen speichern"
              : "Erstellen"}
        </Button>
        <Button variant="secondary" onClick={() => setShowPreview(true)}>
          Vorschau
        </Button>
        <Button
          variant="tertiary"
          onClick={() =>
            router.push(
              isEditMode
                ? "/grammar/exercises/multichoice"
                : "/admin/create-exercise"
            )
          }
        >
          Abbrechen
        </Button>
      </div>

      {/* --- Preview Modal --- */}
      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-content">
            <h2>Vorschau: {title}</h2>
            {/* FIX 3: Removed description from here */}

            <div className="preview-sentence">
              {sections.map((s, i) =>
                s.type === "text" ? (
                  <span key={i} className="preview-text">
                    {s.value}&nbsp;
                  </span>
                ) : s.type === "multichoice" ? (
                  <select key={i} className="preview-select">
                    <option value="">???</option>
                    {s.options.map((opt, k) => (
                      <option key={k} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : s.type === "gap" ? (
                  <input
                    key={i}
                    type="text"
                    className="preview-select"
                    placeholder="..."
                    disabled
                  />
                ) : s.type === "linebreak" ? (
                  <br key={i} />
                ) : null
              )}
            </div>

            <div className="preview-close">
              <Button onClick={() => setShowPreview(false)}>Schließen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
