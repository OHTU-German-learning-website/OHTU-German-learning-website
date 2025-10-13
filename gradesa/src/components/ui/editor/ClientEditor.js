import React, { useEffect, useRef, forwardRef } from "react";

const ClientEditor = forwardRef((props, ref) => {
  const containerRef = (useRef < HTMLDivElement) | (null > null);
  const defaultContentRef = useRef(props.defaultContent);

  useEffect(() => {
    const load = async () => {
      const Quill = (await import("quill")).default;
      const container = containerRef?.current;
      const quill = new Quill(container, { theme: "snow" });
      ref.current = quill;

      if (defaultContentRef.current) {
        quill.clipboard.dangerouslyPasteHTML(defaultContentRef.current);
      }
    };
    load();

    return () => {
      ref.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} />;
});

export default ClientEditor;
