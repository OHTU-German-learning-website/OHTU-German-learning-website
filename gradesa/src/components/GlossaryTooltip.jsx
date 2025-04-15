"use client";
import { useGlossary } from "@/context/glossary.context";
import { useState, useRef, useEffect } from "react";
import styles from "./GlossaryTooltip.module.css";
import { createPortal } from "react-dom";

export default function GlossaryTooltip({ word, children }) {
  const { wordMap, isLoading } = useGlossary();
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const wordRef = useRef(null);
  const tooltipRef = useRef(null);
  const [portalElement, setPortalElement] = useState(null);

  const lowercaseWord = word.toLowerCase();
  const entry = wordMap[lowercaseWord];
  const hasDefinition = !isLoading && entry;

  useEffect(() => {
    const portal = document.getElementById("tooltip-portal");
    if (portal) {
      setPortalElement(portal);
    }
  }, []);

  useEffect(() => {
    if (isOpen && wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      setTooltipPosition({
        left: rect.left + scrollLeft + rect.width / 2,
        top: rect.top + scrollTop - 10,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        wordRef.current &&
        !wordRef.current.contains(event.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!hasDefinition) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        ref={wordRef}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.glossaryWord}
      >
        {children}
      </span>

      {isOpen &&
        portalElement &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              position: "absolute",
              left: `${tooltipPosition.left}px`,
              top: `${tooltipPosition.top}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <h4 className={styles.tooltipTitle}>{entry.word}</h4>
            <p className={styles.tooltipDefinition}>{entry.word_definition}</p>
          </div>,
          portalElement
        )}
    </>
  );
}
