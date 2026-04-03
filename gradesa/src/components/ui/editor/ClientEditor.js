import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

const ClientEditor = (props) => {
  const containerRef = useRef(null);
  const updateEditorContentRef = useRef(props.updateEditorContent);

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
        quill.on(Quill.events.TEXT_CHANGE, () => {
          updateEditorContentRef.current?.(quill.root.innerHTML);
        });
        if (props.defaultContent) {
          const delta = quill.clipboard.convert({ html: props.defaultContent });
          quill.updateContents(delta, Quill.sources.USER);
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
