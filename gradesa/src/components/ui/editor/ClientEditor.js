import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

function setHtmlContent(quill, html) {
  const content = String(html || "");
  quill.setContents([], "silent");
  if (!content) {
    return;
  }
  quill.clipboard.dangerouslyPasteHTML(0, content, "api");
}

const ClientEditor = (props) => {
  const containerRef = useRef(null);
  const updateEditorContentRef = useRef(props.updateEditorContent);
  const quillRef = useRef(null);
  const lastUserHtmlRef = useRef("");

  useEffect(() => {
    updateEditorContentRef.current = props.updateEditorContent;
  }, [props.updateEditorContent]);

  useEffect(() => {
    let quill;
    const load = async () => {
      const Quill = (await import("quill")).default;
      const TableBetter = (await import("quill-table-better")).default;
      Quill.register(
        {
          "modules/table-better": TableBetter,
        },
        true
      );
      if (containerRef.current && containerRef.current.children.length === 0) {
        const toolbarOptions = [
          [{ header: [false, 1, 2, 3] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "image", { color: [] }, { background: [] }, "table-better"],

          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
        ];
        quill = new Quill(containerRef.current, {
          theme: "snow",
          modules: {
            toolbar: toolbarOptions,
            table: false,
            "table-better": {
              language: "en_US",
              menus: [
                "column",
                "row",
                "merge",
                "table",
                "cell",
                "wrap",
                "copy",
                "delete",
              ],
              toolbarTable: true,
            },
          },
          keyboard: {
            bindings: TableBetter.keyboardBindings,
          },
        });
        quill.root.setAttribute("spellcheck", false);
        quill.root.style.fontSize = "1.125rem";
        quill.root.style.lineHeight = "1.7";
        quill.on(Quill.events.TEXT_CHANGE, (_delta, _oldDelta, source) => {
          if (source !== Quill.sources.USER) {
            return;
          }
          const html = quill.root.innerHTML;
          lastUserHtmlRef.current = html;
          updateEditorContentRef.current?.(html);
        });
        quillRef.current = quill;
        if (props.defaultContent) {
          setHtmlContent(quill, props.defaultContent);
        }
      }
    };
    load();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    const nextContent = props.defaultContent || "";
    const currentContent = quill.root.innerHTML;

    if (
      nextContent === currentContent ||
      nextContent === lastUserHtmlRef.current
    ) {
      return;
    }

    setHtmlContent(quill, nextContent);
  }, [props.defaultContent]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default ClientEditor;
