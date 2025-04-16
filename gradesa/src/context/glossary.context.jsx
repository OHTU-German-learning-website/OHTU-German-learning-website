"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import useQuery from "@/shared/hooks/useQuery";

const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
  const { data: entries = [], isLoading, error } = useQuery("/glossary");

  const wordMap = useMemo(() => {
    if (!entries || entries.length === 0) return {};

    return entries.reduce((acc, entry) => {
      acc[entry.word.toLowerCase()] = entry;
      return acc;
    }, {});
  }, [entries]);

  const value = {
    entries,
    wordMap,
    isLoading,
    error,
  };

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  );
}
export function useGlossary() {
  const context = useContext(GlossaryContext);

  if (context === null) {
    throw new Error("useGlossary must be used within a GlossaryProvider");
  }

  return context;
}
