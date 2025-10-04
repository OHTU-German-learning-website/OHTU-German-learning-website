import React, { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],

      [{ header: 1 }, { header: 2 }, { header: 3 }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
    ];
    const quill = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
    });

    ref.current = quill;

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;
