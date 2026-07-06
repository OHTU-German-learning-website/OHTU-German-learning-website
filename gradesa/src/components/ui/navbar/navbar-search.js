"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/shared/utils/basePath";
import "./navbar-search.css";

const GROUP_LABELS = {
  resources: "Seite: Lernen",
  communications: "Seite: Kommunikation",
  grammar: "Seite: Grammatik",
  freeform: "Übung: Freie-Übung",
  multichoice: "Übung: Multiple Choice",
  click: "Übung: Klick",
  fillinthegap: "Übung: Lückentext",
  dragdrop: "Übung: Sortieren/Gruppieren",
  "dnd-match": "Übung: Zuordnung",
  "memory-game": "Übung: Memory Game",
  "jumbled-sentence": "Übung: Satzmix",
  static: "Seite",
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  if (!text) return null;

  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, "i"));

  return parts.map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="navbar-search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function NavbarSearch() {
  const router = useRouter();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          withBasePath(`/api/search?q=${encodeURIComponent(trimmedQuery)}`),
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data = await response.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search request failed:", error);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [trimmedQuery]);

  const totalItems = results.length;

  const helperText = useMemo(() => {
    if (trimmedQuery.length < 2) {
      return "Mindestens 2 Zeichen eingeben";
    }

    if (isLoading) {
      return "Suche läuft...";
    }

    if (!results.length) {
      return "Keine Treffer";
    }

    return `${results.length} Treffer`;
  }, [isLoading, results.length, trimmedQuery.length]);

  const navigateTo = (url) => {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(url);
  };

  const handleKeyDown = (event) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!totalItems) return;
      setActiveIndex((prev) => (prev + 1) % totalItems);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!totalItems) return;
      setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter") {
      if (!totalItems) return;
      event.preventDefault();
      const target = results[activeIndex] || results[0];
      if (target?.url) {
        navigateTo(target.url);
      }
    }
  };

  return (
    <div className="navbar-search" ref={rootRef}>
      <label htmlFor="global-search" className="navbar-search-label">
        Suche
      </label>
      <input
        id="global-search"
        type="search"
        className="navbar-search-input"
        placeholder="Seiten und Übungen durchsuchen"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <div className="navbar-search-helper">{helperText}</div>

      {isOpen && trimmedQuery.length >= 2 && (
        <div className="navbar-search-dropdown">
          {results.length > 0 ? (
            <ul className="navbar-search-list">
              {results.map((item, index) => {
                const isActive = activeIndex === index;
                const label = GROUP_LABELS[item.group] || "Ergebnis";

                return (
                  <li key={`${item.url}-${index}`}>
                    <button
                      type="button"
                      className={`navbar-search-item ${isActive ? "active" : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigateTo(item.url)}
                    >
                      <span className="navbar-search-item-label">{label}</span>
                      <span className="navbar-search-item-title">
                        {highlightText(item.title, trimmedQuery)}
                      </span>
                      {item.snippet && (
                        <span className="navbar-search-item-snippet">
                          {highlightText(item.snippet, trimmedQuery)}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="navbar-search-empty">Keine Treffer gefunden</div>
          )}
        </div>
      )}
    </div>
  );
}
