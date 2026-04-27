"use client";
import { useState } from "react";
import { Row } from "@/components/ui/layout/container";
import "./dragdrop.css";

export default function PreviewDragDrop({ title, fields }) {
  const getWords = (content) => {
    return content
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);
  };

  const allWords = fields
    .flatMap((field) =>
      getWords(field.content).map((word) => ({
        text: word,
        color: field.color,
      }))
    )
    .slice(0, 5)
    .sort(() => 0.5 - Math.random());

  return (
    <div className="previewContainer">
      <h1>{title || "Untitled Exercise"}</h1>

      <div className="categoriesContainer">
        {allWords.map((word, index) => (
          <div key={index} className="wordbox">
            <span>{word.text}</span>
          </div>
        ))}
      </div>

      <Row gap="md">
        {fields.map((field, index) => (
          <div key={index} className="dustbin">
            {field.category}
          </div>
        ))}
      </Row>
    </div>
  );
}
