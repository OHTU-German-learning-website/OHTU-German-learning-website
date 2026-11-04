import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";
import "quill-resize-module/dist/resize.css";
import "./editor.css";
import {
  createSectionBookmarkId,
  getSectionAnchors,
} from "@/shared/utils/sectionAnchors";

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
  const defaultContentRef = useRef(props.defaultContent);
  defaultContentRef.current = props.defaultContent;
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
      const QuillLink = Quill.import("formats/link");
      const QuillEmbed = Quill.import("blots/embed");
      class SectionLink extends QuillLink {
        static sanitize(url) {
          if (
            typeof url === "string" &&
            url.startsWith("#") &&
            url.length > 1
          ) {
            return url;
          }
          return super.sanitize(url);
        }

        static create(value) {
          const node = super.create(value);
          if (typeof value === "string" && value.startsWith("#")) {
            node.removeAttribute("target");
            node.removeAttribute("rel");
          }
          return node;
        }

        format(name, value) {
          super.format(name, value);
          if (
            name === "link" &&
            typeof value === "string" &&
            value.startsWith("#")
          ) {
            this.domNode.removeAttribute("target");
            this.domNode.removeAttribute("rel");
          }
        }
      }
      class SectionBookmark extends QuillEmbed {
        static blotName = "section-bookmark";
        static tagName = "span";
        static className = "ql-section-bookmark";

        static create(value) {
          const node = super.create();
          node.id = value.id;
          node.dataset.sectionBookmark = value.label;
          node.textContent = "\u200b";
          node.title = `Bookmark: ${value.label}`;
          node.setAttribute("aria-label", `Bookmark: ${value.label}`);
          node.setAttribute("contenteditable", "false");
          return node;
        }

        static value(node) {
          return {
            id: node.id,
            label: node.dataset.sectionBookmark,
          };
        }
      }
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
      Quill.register("formats/link", SectionLink, true);
      Quill.register(SectionBookmark, true);
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
        const toolbar = quill.getModule("toolbar").container;
        const sectionLinkToolbar = document.createElement("span");
        sectionLinkToolbar.className = "section-link-toolbar";
        const sectionLinkButton = document.createElement("button");
        sectionLinkButton.type = "button";
        sectionLinkButton.className = "section-link-button";
        sectionLinkButton.setAttribute(
          "aria-label",
          "Insert link to a section"
        );
        sectionLinkButton.textContent = "Link";
        const sectionLinkDialog = document.createElement("div");
        sectionLinkDialog.className = "section-link-dialog";
        sectionLinkDialog.hidden = true;
        sectionLinkDialog.setAttribute("role", "dialog");
        sectionLinkDialog.setAttribute("aria-label", "Insert link");
        const sectionLinkTitle = document.createElement("strong");
        sectionLinkTitle.textContent = "Insert link";
        const displayTextLabel = document.createElement("label");
        displayTextLabel.textContent = "Text to display";
        const displayTextInput = document.createElement("input");
        displayTextInput.type = "text";
        displayTextInput.className = "section-link-display-text";
        displayTextLabel.appendChild(displayTextInput);
        const sectionLinkLabel = document.createElement("label");
        sectionLinkLabel.textContent = "Place in this document";
        const sectionLinkSelect = document.createElement("select");
        sectionLinkSelect.className = "section-link-picker";
        sectionLinkLabel.appendChild(sectionLinkSelect);
        const sectionLinkStatus = document.createElement("span");
        sectionLinkStatus.className = "section-link-status";
        sectionLinkStatus.setAttribute("role", "status");
        sectionLinkStatus.setAttribute("aria-live", "polite");
        const sectionLinkActions = document.createElement("div");
        sectionLinkActions.className = "section-link-actions";
        const cancelSectionLinkButton = document.createElement("button");
        cancelSectionLinkButton.type = "button";
        cancelSectionLinkButton.textContent = "Cancel";
        const insertSectionLinkButton = document.createElement("button");
        insertSectionLinkButton.type = "button";
        insertSectionLinkButton.className = "section-link-insert";
        insertSectionLinkButton.textContent = "Insert";
        sectionLinkActions.append(
          cancelSectionLinkButton,
          insertSectionLinkButton
        );
        sectionLinkDialog.append(
          sectionLinkTitle,
          displayTextLabel,
          sectionLinkLabel,
          sectionLinkStatus,
          sectionLinkActions
        );
        sectionLinkToolbar.append(sectionLinkButton, sectionLinkDialog);
        const bookmarkButton = document.createElement("button");
        bookmarkButton.type = "button";
        bookmarkButton.className =
          "section-link-button section-link-bookmark-button";
        bookmarkButton.textContent = "\u00a0Bookmark";
        bookmarkButton.setAttribute(
          "aria-label",
          "Add a link target at the cursor"
        );
        const bookmarkDialog = document.createElement("div");
        bookmarkDialog.className = "section-link-dialog";
        bookmarkDialog.hidden = true;
        bookmarkDialog.setAttribute("role", "dialog");
        bookmarkDialog.setAttribute("aria-label", "Add bookmark");
        const bookmarkTitle = document.createElement("strong");
        bookmarkTitle.textContent = "Add bookmark";
        const bookmarkLabel = document.createElement("label");
        bookmarkLabel.textContent = "Bookmark name";
        const bookmarkInput = document.createElement("input");
        bookmarkInput.type = "text";
        bookmarkInput.className = "section-link-bookmark-name";
        bookmarkLabel.appendChild(bookmarkInput);
        const bookmarkStatus = document.createElement("span");
        bookmarkStatus.className = "section-link-status";
        bookmarkStatus.setAttribute("role", "status");
        bookmarkStatus.setAttribute("aria-live", "polite");
        const bookmarkActions = document.createElement("div");
        bookmarkActions.className = "section-link-actions";
        const cancelBookmarkButton = document.createElement("button");
        cancelBookmarkButton.type = "button";
        cancelBookmarkButton.textContent = "Cancel";
        const addBookmarkButton = document.createElement("button");
        addBookmarkButton.type = "button";
        addBookmarkButton.className = "section-link-insert";
        addBookmarkButton.textContent = "Add";
        bookmarkActions.append(cancelBookmarkButton, addBookmarkButton);
        bookmarkDialog.append(
          bookmarkTitle,
          bookmarkLabel,
          bookmarkStatus,
          bookmarkActions
        );
        sectionLinkToolbar.append(bookmarkButton, bookmarkDialog);
        toolbar.appendChild(sectionLinkToolbar);

        const updateSectionLinkOptions = () => {
          const headingElements = Array.from(
            quill.root.querySelectorAll("h1, h2, h3")
          );
          const sectionAnchors = getSectionAnchors(
            headingElements.map((heading) => ({
              text: heading.textContent,
              id: heading.id,
              level: Number(heading.tagName.slice(1)),
            })),
            Array.from(
              quill.root.querySelectorAll("[id]"),
              (element) => element.id
            )
          );
          sectionLinkSelect.replaceChildren(
            new Option("Link to section...", "")
          );
          sectionAnchors.forEach((section) => {
            const option = new Option(
              `${"#".repeat(section.level)} ${section.text.trim()}`,
              section.id
            );
            sectionLinkSelect.appendChild(option);
          });
          const bookmarks = Array.from(
            quill.root.querySelectorAll("[data-section-bookmark]")
          );
          bookmarks.forEach((bookmark) => {
            sectionLinkSelect.appendChild(
              new Option(
                `Bookmark: ${bookmark.dataset.sectionBookmark}`,
                bookmark.id
              )
            );
          });
          insertSectionLinkButton.disabled =
            sectionAnchors.length + bookmarks.length === 0;
        };
        let savedSelection = null;
        let savedBookmarkSelection = null;
        sectionLinkButton.addEventListener("mousedown", (event) => {
          event.preventDefault();
          savedSelection = quill.getSelection();
          sectionLinkStatus.textContent = "";
          sectionLinkSelect.value = "";
          const selectedText = savedSelection
            ? quill.getText(savedSelection.index, savedSelection.length)
            : "";
          displayTextInput.value = selectedText;
          sectionLinkDialog.hidden = false;
          displayTextInput.focus();
        });
        cancelSectionLinkButton.addEventListener("click", () => {
          sectionLinkDialog.hidden = true;
          savedSelection = null;
          quill.focus();
        });
        bookmarkButton.addEventListener("mousedown", (event) => {
          event.preventDefault();
          savedBookmarkSelection = quill.getSelection();
          bookmarkInput.value = "";
          bookmarkStatus.textContent = "";
          bookmarkDialog.hidden = false;
          bookmarkInput.focus();
        });
        cancelBookmarkButton.addEventListener("click", () => {
          bookmarkDialog.hidden = true;
          savedBookmarkSelection = null;
          quill.focus();
        });
        addBookmarkButton.addEventListener("click", () => {
          const label = bookmarkInput.value.trim();
          if (!label) {
            bookmarkStatus.textContent = "Enter a name for the bookmark.";
            return;
          }

          const selection = savedBookmarkSelection || quill.getSelection(true);
          if (!selection) {
            bookmarkStatus.textContent =
              "Choose a position in the editor for the bookmark.";
            return;
          }

          const id = createSectionBookmarkId(
            label,
            Array.from(quill.root.querySelectorAll("[id]"), (element) => {
              return element.id;
            })
          );
          quill.insertEmbed(
            selection.index,
            "section-bookmark",
            { id, label },
            "user"
          );
          quill.setSelection(selection.index + 1, 0, "silent");
          savedBookmarkSelection = null;
          bookmarkDialog.hidden = true;
          quill.focus();
          bookmarkStatus.textContent = "";
        });
        insertSectionLinkButton.addEventListener("click", () => {
          const sectionId = sectionLinkSelect.value;
          const displayText = displayTextInput.value.trim();
          if (!displayText || !sectionId) {
            sectionLinkStatus.textContent =
              "Enter link text and choose a section.";
            return;
          }

          const selection = savedSelection || quill.getSelection(true);
          if (!selection) {
            sectionLinkStatus.textContent =
              "Choose a position in the editor for the link.";
            return;
          }

          if (selection.length > 0) {
            quill.deleteText(selection.index, selection.length, "user");
          }
          quill.insertText(
            selection.index,
            displayText,
            { link: `#${sectionId}` },
            "user"
          );
          quill.setSelection(selection.index + displayText.length, 0, "silent");
          savedSelection = null;
          sectionLinkDialog.hidden = true;
          quill.focus();
          sectionLinkStatus.textContent = "";
        });
        updateSectionLinkOptions();
        quill.root.setAttribute("spellcheck", false);
        quill.root.style.fontSize = "1.125rem";
        quill.root.style.lineHeight = "1.7";
        quill.on(Quill.events.TEXT_CHANGE, (_delta, _oldDelta, source) => {
          if (source === Quill.sources.SILENT) {
            return;
          }

          applyTableAutoContrast(quill);
          updateSectionLinkOptions();

          const html = normalizeEditorHtml(quill.root.innerHTML);
          lastUserHtmlRef.current = html;
          updateEditorContentRef.current?.(html);
        });

        const syncNormalizedContent = () => {
          const normalizedHtml = normalizeEditorHtml(quill.root.innerHTML);
          if (normalizedHtml !== quill.root.innerHTML) {
            setHtmlContent(quill, normalizedHtml);
          }
          if (normalizedHtml !== defaultContentRef.current) {
            lastUserHtmlRef.current = normalizedHtml;
            updateEditorContentRef.current?.(normalizedHtml);
          }
        };

        quillRef.current = quill;
        setupTablePropertiesRepositioning();
        // Quill loads asynchronously, so content may have arrived after the first render.
        if (defaultContentRef.current) {
          setHtmlContent(quill, defaultContentRef.current);
          applyTableAutoContrast(quill);
          updateSectionLinkOptions();
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
