import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const ClientEditor = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let quill;
    const load = async () => {
      const Quill = (await import("quill")).default;
      if (containerRef.current && containerRef.current.children.length === 0) {
        quill = new Quill(containerRef.current, { theme: "snow" });
        if (props.defaultContent) {
          quill.clipboard.dangerouslyPasteHTML(props.defaultContent);
        }
      }
    };
    load();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default ClientEditor;
