import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";
import "quill-resize-module/dist/resize.css";

function parseCssColorToRgb(value) {
  const color = String(value || "")
    .trim()
    .toLowerCase();
  if (!color || color === "transparent") {
    return null;
  }

  const hexMatch = color.match(
    /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i
  );
  if (hexMatch) {
    const hex = hexMatch[1];
    const normalized =
      hex.length === 3 || hex.length === 4
        ? hex
            .split("")
            .map((char) => `${char}${char}`)
            .join("")
        : hex;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }

  const rgbMatch = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (rgbMatch) {
    const alpha = Number(rgbMatch[4] ?? 1);
    if (Number.isFinite(alpha) && alpha <= 0) {
      return null;
    }
    return {
      r: Math.min(255, Math.max(0, Math.round(Number(rgbMatch[1])))),
      g: Math.min(255, Math.max(0, Math.round(Number(rgbMatch[2])))),
      b: Math.min(255, Math.max(0, Math.round(Number(rgbMatch[3])))),
    };
  }

  return null;
}

function channelToLinear(channel) {
  const srgb = channel / 255;
  if (srgb <= 0.04045) {
    return srgb / 12.92;
  }
  return ((srgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }) {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function contrastRatio(l1, l2) {
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function pickReadableForeground(backgroundColor) {
  const backgroundRgb = parseCssColorToRgb(backgroundColor);
  if (!backgroundRgb) {
    return null;
  }

  const backgroundLuminance = relativeLuminance(backgroundRgb);
  const whiteContrast = contrastRatio(backgroundLuminance, 1);
  const blackContrast = contrastRatio(backgroundLuminance, 0);

  return blackContrast >= whiteContrast ? "#000000" : "#ffffff";
}

function applyTableAutoContrast(quill) {
  if (!quill?.root || typeof window === "undefined") {
    return false;
  }

  const candidateNodes = quill.root.querySelectorAll("table, td, th");
  let mutated = false;

  candidateNodes.forEach((node) => {
    const computedBg = window.getComputedStyle(node).backgroundColor;
    const nextForeground = pickReadableForeground(computedBg);

    if (!nextForeground) {
      if (node.dataset.autoContrastApplied === "true") {
        node.style.removeProperty("color");
        node.style.removeProperty("caret-color");
        delete node.dataset.autoContrastApplied;
        mutated = true;
      }
      return;
    }

    const currentColor = (node.style.color || "").trim().toLowerCase();
    const currentCaretColor = (node.style.caretColor || "")
      .trim()
      .toLowerCase();
    const desiredColor = nextForeground.toLowerCase();

    if (
      currentColor !== desiredColor ||
      currentCaretColor !== desiredColor ||
      node.dataset.autoContrastApplied !== "true"
    ) {
      node.style.color = nextForeground;
      node.style.caretColor = nextForeground;
      node.dataset.autoContrastApplied = "true";
      mutated = true;
    }
  });

  return mutated;
}

function setHtmlContent(quill, html) {
  const content = normalizeEditorHtml(String(html || ""));
  quill.setContents([], "silent");
  if (!content) {
    return;
  }
  quill.clipboard.dangerouslyPasteHTML(0, content, "api");
}

function isNodeEffectivelyEmptyText(node) {
  if (!(node instanceof HTMLElement)) {
    return false;
  }

  if (!["P", "DIV"].includes(node.tagName)) {
    return false;
  }

  const text = (node.textContent || "")
    .replace(/[\u00a0\u200b\ufeff]/g, " ")
    .trim();
  if (text.length > 0) {
    return false;
  }

  const meaningfulChildren = Array.from(node.children).filter((child) => {
    return child.tagName !== "BR";
  });

  return meaningfulChildren.length === 0;
}

function normalizeEditorHtml(rawHtml) {
  const html = String(rawHtml || "");
  if (!html) {
    return "";
  }

  if (typeof document === "undefined") {
    return html;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  // Remove transient table-selection classes so saved HTML does not keep
  // "selected" visuals when reopening or rendering the page.
  const transientClasses = [
    "ql-cell-focused",
    "ql-cell-selected",
    "ql-table-tooltip-hover",
  ];
  wrapper.querySelectorAll("[class]").forEach((node) => {
    transientClasses.forEach((className) => node.classList.remove(className));
    if (!node.className.trim()) {
      node.removeAttribute("class");
    }
  });

  const tables = wrapper.querySelectorAll("table");
  tables.forEach((table) => {
    let prev = table.previousElementSibling;
    while (isNodeEffectivelyEmptyText(prev)) {
      const toRemove = prev;
      prev = prev.previousElementSibling;
      toRemove.remove();
    }

    let next = table.nextElementSibling;
    while (isNodeEffectivelyEmptyText(next)) {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }
  });

  // Remove leading/trailing empty blocks introduced by Quill around content.
  while (isNodeEffectivelyEmptyText(wrapper.firstElementChild)) {
    wrapper.firstElementChild.remove();
  }
  while (isNodeEffectivelyEmptyText(wrapper.lastElementChild)) {
    wrapper.lastElementChild.remove();
  }

  // Collapse consecutive empty paragraphs/divs to a single one to stop
  // cumulative "one line lower" drift between repeated save/edit cycles.
  let cursor = wrapper.firstElementChild;
  while (cursor) {
    const next = cursor.nextElementSibling;
    if (
      isNodeEffectivelyEmptyText(cursor) &&
      isNodeEffectivelyEmptyText(next)
    ) {
      next.remove();
      continue;
    }
    cursor = next;
  }

  return wrapper.innerHTML;
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

      const isManagedTableCellTarget = (target) => {
        const cell = target.closest("td,th");
        if (!(cell instanceof HTMLTableCellElement)) {
          return true;
        }

        const table = cell.closest("table");
        if (!(table instanceof HTMLTableElement)) {
          return false;
        }

        return table.classList.contains("ql-table-better");
      };

      const onWindowResize = () => scheduleReposition();
      const onEditorScroll = () => scheduleReposition();
      const onEditorClick = () => scheduleReposition();
      const onEditorMouseDownCapture = (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }

        if (!isManagedTableCellTarget(target)) {
          event.stopPropagation();
        }
      };
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

        if (!isManagedTableCellTarget(target)) {
          event.stopPropagation();
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
        "mousedown",
        onEditorMouseDownCapture,
        true
      );
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
          "mousedown",
          onEditorMouseDownCapture,
          true
        );
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
              const html = normalizeEditorHtml(quill.root.innerHTML);
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

          applyTableAutoContrast(quill);

          const html = normalizeEditorHtml(quill.root.innerHTML);
          lastUserHtmlRef.current = html;
          updateEditorContentRef.current?.(html);
        });

        const syncNormalizedContent = () => {
          const normalizedHtml = normalizeEditorHtml(quill.root.innerHTML);
          if (normalizedHtml !== quill.root.innerHTML) {
            setHtmlContent(quill, normalizedHtml);
          }
          if (normalizedHtml !== props.defaultContent) {
            lastUserHtmlRef.current = normalizedHtml;
            updateEditorContentRef.current?.(normalizedHtml);
          }
        };

        quillRef.current = quill;
        setupTablePropertiesRepositioning();
        if (props.defaultContent) {
          setHtmlContent(quill, props.defaultContent);
          applyTableAutoContrast(quill);
          syncNormalizedContent();
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
    applyTableAutoContrast(quill);

    const html = normalizeEditorHtml(quill.root.innerHTML);
    if (html !== nextContent) {
      setHtmlContent(quill, html);
    }
    if (html !== nextContent || html !== lastUserHtmlRef.current) {
      lastUserHtmlRef.current = html;
      updateEditorContentRef.current?.(html);
    }
  }, [props.defaultContent]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default ClientEditor;
