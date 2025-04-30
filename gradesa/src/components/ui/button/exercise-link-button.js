"use client";
import { Button } from "@/components/ui/button";

export function ExerciseLinkButton({ id, children, ...props }) {
  const copyToClipboard = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const origin = window.location.origin;
      const url = `${origin}/api/redirect/exercises/${id}`;
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  };
  return (
    <Button onClick={copyToClipboard} {...props}>
      {children}
    </Button>
  );
}
