import React, { useEffect, useRef } from "react";
// Importation strategy has a conflict with Grammarly browser extension! Removing it helps.
const ClientEditor = (props) => {
  const containerRef = useRef(null);
  const defaultContentRef = useRef(props.defaultContent);

  useEffect(() => {
    const load = async () => {
      const Quill = (await import("quill")).default;
      const container = containerRef?.current;
      const quill = new Quill(container, { theme: "snow" });

      if (defaultContentRef.current) {
        quill.clipboard.dangerouslyPasteHTML(defaultContentRef.current);
      }
    };
    load();

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ClientEditor;
