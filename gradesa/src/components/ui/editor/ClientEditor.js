import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const ClientEditor = (props) => {
  const containerRef = useRef(null);
  const updateEditorContentRef = useRef(props.updateEditorContent);

  useEffect(() => {
    let quill;
    const load = async () => {
      const Quill = (await import("quill")).default;
      if (containerRef.current && containerRef.current.children.length === 0) {
        const toolbarOptions = [
          [{ header: [false, 1, 2, 3] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "image", { color: [] }],

          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
        ];
        quill = new Quill(containerRef.current, {
          theme: "snow",
          modules: { toolbar: toolbarOptions },
        });
        quill.root.setAttribute("spellcheck", false);
        quill.on(Quill.events.TEXT_CHANGE, () => {
          updateEditorContentRef.current?.(quill.getSemanticHTML());
        });
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
