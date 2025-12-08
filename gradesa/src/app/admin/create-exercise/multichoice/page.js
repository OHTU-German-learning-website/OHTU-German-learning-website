"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import "./multichoice.css";

export default function CreateMultichoicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  // Which dropdown is currently being edited? (Index of the section)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // --- Actions ---

  const addTextSection = () => {
    setSections([
      ...sections,
      { id: crypto.randomUUID(), type: "text", value: "" },
    ]);
  };

  const addMultiChoiceSection = () => {
    const newIndex = sections.length;
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        type: "multichoice",
        options: ["Option 1", "Option 2"],
        correct: 0, // Index of the correct answer
      },
    ]);
    // Automatically select the new dropdown for editing
    setActiveDropdownIndex(newIndex);
  };

  const handleTextChange = (index, newValue) => {
    const newSections = [...sections];
    newSections[index].value = newValue;
    setSections(newSections);
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    if (activeDropdownIndex === index) setActiveDropdownIndex(null);
  };

  // --- Backend Submission ---

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const res = await fetch("/api/admin/exercises/multichoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          content: sections, // Sends the array exactly as backend expects
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Speichern");
      }

      router.push("/admin/create-exercise");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>Multiple Choice Übung erstellen</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Titel</label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel der Übung"
        />
      </div>

      <div className="form-group">
        <label>Beschreibung</label>
        <input
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anleitung für den Schüler"
        />
      </div>

      <hr className="divider" />

      {/* --- The Sentence Builder (Inline Flow) --- */}
      <div className="sentence-builder-container">
        <h3>Satz bauen:</h3>
        <div className="sentence-flow">
          {sections.map((section, index) => {
            if (section.type === "text") {
              return (
                <div key={section.id} className="inline-block-wrapper">
                  <input
                    type="text"
                    value={section.value}
                    onChange={(e) => handleTextChange(index, e.target.value)}
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
            } else {
              // Multichoice Block
              const isActive = activeDropdownIndex === index;
              return (
                <div key={section.id} className="inline-block-wrapper">
                  <button
                    onClick={() => setActiveDropdownIndex(index)}
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
            }
          })}
        </div>

        {/* --- Buttons to add new parts --- */}
        <div className="action-row">
          <Button size="sm" onClick={addTextSection}>
            + Text
          </Button>
          <Button size="sm" onClick={addMultiChoiceSection}>
            + Dropdown
          </Button>
        </div>
      </div>

      {/* --- Dropdown Editor (Only shows if a dropdown is clicked) --- */}
      {activeDropdownIndex !== null && sections[activeDropdownIndex] && (
        <div className="dropdown-editor-panel">
          <h3>Optionen bearbeiten</h3>
          <p className="hint">
            Wähle den Radio-Button für die richtige Antwort.
          </p>

          {sections[activeDropdownIndex].options.map((opt, optIndex) => (
            <div key={optIndex} className="option-row">
              <input
                type="radio"
                name="correct-answer"
                checked={sections[activeDropdownIndex].correct === optIndex}
                onChange={() => {
                  const newSections = [...sections];
                  newSections[activeDropdownIndex].correct = optIndex;
                  setSections(newSections);
                }}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const newSections = [...sections];
                  newSections[activeDropdownIndex].options[optIndex] =
                    e.target.value;
                  setSections(newSections);
                }}
                className="form-input option-input"
              />
              <button
                className="delete-btn"
                onClick={() => {
                  const newSections = [...sections];
                  newSections[activeDropdownIndex].options = newSections[
                    activeDropdownIndex
                  ].options.filter((_, i) => i !== optIndex);
                  // Reset correct index if needed
                  if (newSections[activeDropdownIndex].correct >= optIndex) {
                    newSections[activeDropdownIndex].correct = 0;
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
              newSections[activeDropdownIndex].options.push(
                `Option ${newSections[activeDropdownIndex].options.length + 1}`
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
          {isSubmitting ? "Speichern..." : "Erstellen"}
        </Button>
        <Button variant="secondary" onClick={() => setShowPreview(true)}>
          Vorschau
        </Button>
        <Button
          variant="tertiary"
          onClick={() => router.push("/admin/create-exercise")}
        >
          Abbrechen
        </Button>
      </div>

      {/* --- Preview Modal --- */}
      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-content">
            <h2>Vorschau: {title}</h2>
            <p className="preview-desc">{description}</p>

            <div className="preview-sentence">
              {sections.map((s, i) =>
                s.type === "text" ? (
                  <span key={i} className="preview-text">
                    {s.value}&nbsp;
                  </span>
                ) : (
                  <select key={i} className="preview-select">
                    <option value="">???</option>
                    {s.options.map((opt, k) => (
                      <option key={k} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )
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
