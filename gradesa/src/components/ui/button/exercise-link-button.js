"use client";
import { Button } from "@/components/ui/button";

export function ExerciseLinkButton({ href, children, ...props }) {
  const copyToClipboard = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const origin = window.location.origin;
      const url = `${origin}${href}`;
      await navigator.clipboard.writeText(url);
      alert("Link kopiert!");
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Link konnte nicht kopiert werden.");
      return false;
    }
  };
  return (
    <Button onClick={copyToClipboard} {...props}>
      {children}
    </Button>
  );
}
