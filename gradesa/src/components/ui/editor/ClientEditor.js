import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";
import "quill-resize-module/dist/resize.css";

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
    let tableFormObserver;
    let detachRepositionListeners;
    let lastTableMenuRect = null;
    let rafRepositionId = null;

    const getActiveTable = () => {
      if (!quill) {
        return null;
      }

      const tableBetterModule = quill.getModule("table-better");
      const tableFromModule = tableBetterModule?.tableMenus?.table;
      if (tableFromModule instanceof HTMLElement) {
        return tableFromModule;
      }

      const selectedCell = quill.root.querySelector(
        "td.ql-cell-focused, td.ql-cell-selected, th.ql-cell-focused, th.ql-cell-selected"
      );
      if (selectedCell instanceof HTMLElement) {
        return selectedCell.closest("table");
      }

      return null;
    };

    const getAnchorRect = () => {
      const liveMenus = quill?.container?.querySelector(
        ".ql-table-menus-container"
      );
      if (liveMenus instanceof HTMLElement) {
        const rect = liveMenus.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          lastTableMenuRect = rect;
          return rect;
        }
      }

      if (lastTableMenuRect) {
        return lastTableMenuRect;
      }

      const table = getActiveTable();
      if (table instanceof HTMLElement) {
        return table.getBoundingClientRect();
      }

      return null;
    };

    const repositionTablePropertiesForm = () => {
      if (!quill) {
        return;
      }

      const form = quill.container.querySelector(".ql-table-properties-form");
      if (!(form instanceof HTMLElement)) {
        return;
      }

      const anchorRect = getAnchorRect();
      if (!anchorRect) {
        return;
      }

      const formRect = form.getBoundingClientRect();
      const viewportPadding = 8;

      let nextTop = anchorRect.bottom + 10;
      const nextTopIfAbove = anchorRect.top - formRect.height - 10;
      if (nextTop + formRect.height > window.innerHeight - viewportPadding) {
        nextTop = nextTopIfAbove;
      }
      if (nextTop < viewportPadding) {
        nextTop = viewportPadding;
      }

      let nextLeft = anchorRect.left + (anchorRect.width - formRect.width) / 2;
      const maxLeft = Math.max(
        viewportPadding,
        window.innerWidth - formRect.width - viewportPadding
      );
      nextLeft = Math.min(Math.max(viewportPadding, nextLeft), maxLeft);

      form.style.position = "fixed";
      form.style.left = `${Math.round(nextLeft)}px`;
      form.style.top = `${Math.round(nextTop)}px`;
      form.style.margin = "0";
      form.style.zIndex = "9999";
      form.classList.add("ql-table-triangle-none");
    };

    const scheduleReposition = () => {
      if (rafRepositionId !== null) {
        return;
      }
      rafRepositionId = requestAnimationFrame(() => {
        rafRepositionId = null;
        repositionTablePropertiesForm();
      });
    };

    const setupTablePropertiesRepositioning = () => {
      if (!quill?.container) {
        return;
      }

      const onWindowResize = () => scheduleReposition();
      const onEditorScroll = () => scheduleReposition();
      const onEditorClick = () => scheduleReposition();
      const onEditorPointerDown = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const menus = target.closest(".ql-table-menus-container");
        if (menus instanceof HTMLElement) {
          const rect = menus.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            lastTableMenuRect = rect;
          }
        }
      };
      const onEditorClickCapture = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        // quill-table-better has click handlers that call getAttribute on possibly null nodes.
        // Block only invalid clicks before plugin bubbling listeners execute.
        const checkContainer = target.closest(".ql-table-check-container");
        if (checkContainer && !target.closest("span.ql-table-tooltip-hover")) {
          event.stopPropagation();
          return;
        }
      };

      window.addEventListener("resize", onWindowResize);
      quill.root.addEventListener("scroll", onEditorScroll, true);
      quill.root.addEventListener("click", onEditorClick, true);
      quill.container.addEventListener(
        "pointerdown",
        onEditorPointerDown,
        true
      );
      quill.container.addEventListener("click", onEditorClickCapture, true);

      tableFormObserver = new MutationObserver(() => {
        if (quill.container.querySelector(".ql-table-properties-form")) {
          scheduleReposition();
        }
      });

      tableFormObserver.observe(quill.container, {
        childList: true,
        subtree: true,
      });

      detachRepositionListeners = () => {
        window.removeEventListener("resize", onWindowResize);
        quill.root.removeEventListener("scroll", onEditorScroll, true);
        quill.root.removeEventListener("click", onEditorClick, true);
        quill.container.removeEventListener(
          "pointerdown",
          onEditorPointerDown,
          true
        );
        quill.container.removeEventListener(
          "click",
          onEditorClickCapture,
          true
        );
        if (rafRepositionId !== null) {
          cancelAnimationFrame(rafRepositionId);
          rafRepositionId = null;
        }
      };
    };

    const load = async () => {
      const Quill = (await import("quill")).default;
      const TableBetter = (await import("quill-table-better")).default;
      let QuillResize = null;

      try {
        const QuillResizeModule = await import("quill-resize-module");
        QuillResize = QuillResizeModule?.default || QuillResizeModule || null;
      } catch (error) {
        // Keep editor functional even if the resize plugin is unavailable.
        console.warn("Resize plugin could not be loaded", error);
      }

      Quill.register(
        {
          "modules/table-better": TableBetter,
        },
        true
      );
      if (QuillResize) {
        Quill.register("modules/resize", QuillResize, true);
      }
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
        const modules = {
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
        };

        if (QuillResize) {
          modules.resize = {
            modules: ["Resize", "DisplaySize", "Toolbar"],
            parchment: {
              image: {
                attribute: ["width", "height"],
              },
            },
            onChangeSize: (_blot, _activeEle, _size) => {
              // Capture resized image HTML and send to parent immediately.
              const html = quill.root.innerHTML;
              lastUserHtmlRef.current = html;
              updateEditorContentRef.current?.(html);
            },
          };
        }

        quill = new Quill(containerRef.current, {
          theme: "snow",
          modules,
          keyboard: {
            bindings: TableBetter.keyboardBindings,
          },
        });
        quill.root.setAttribute("spellcheck", false);
        quill.root.style.fontSize = "1.125rem";
        quill.root.style.lineHeight = "1.7";
        quill.on(Quill.events.TEXT_CHANGE, (_delta, _oldDelta, source) => {
          if (source === Quill.sources.SILENT) {
            return;
          }
          const html = quill.root.innerHTML;
          lastUserHtmlRef.current = html;
          updateEditorContentRef.current?.(html);
        });
        quillRef.current = quill;
        setupTablePropertiesRepositioning();
        if (props.defaultContent) {
          setHtmlContent(quill, props.defaultContent);
        }
      }
    };
    load();

    return () => {
      tableFormObserver?.disconnect();
      tableFormObserver = null;
      detachRepositionListeners?.();
      detachRepositionListeners = null;
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
