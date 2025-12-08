# UI Components

This short reference documents the UI components in `src/components/ui` — what they do and where they are used.
For layout primitives (Container/Row/Column) see `layout/LAYOUT_COMPONENTS.md`.

## Components

- **anchor**

  - `Anchor` / `AnchoredExercises` — Displays exercises linked to content anchors. Includes admin UI for linking/unlinking exercises to an anchor.

- **box**

  - `Box` — Lightweight box wrapper providing consistent padding, border, and sizing variants for layout blocks.

- **button**

  - `Button` — Styled button used throughout the app with variants (`primary`, `outline`, `click`, etc.) and size/width props.
  - `ExerciseLinkButton` — A Next.js `Link` wrapped in the app's `Button` styles for navigational links.

- **click**

  - `Click` / `WordSelectionExercise` — Interactive "click" exercises where users select words from a text; includes preview/retry, scoring, and feedback handling.

- **dragdrop**

  - Drag & Drop components (`Dustbin`, `Wordbox`, `Area`, etc.) — Implements drag-and-drop exercises and a preview mode for arranging/matching tasks.

- **dropdown**

  - `Dropdown` — A small wrapper around Radix UI’s DropdownMenu for selecting options; includes validation and styling.

- **editor**

  - `ClientEditor` — Quill-based WYSIWYG editor wrapper used by admin pages to edit rich HTML content.

- **fillinthegap**

  - Fill-in-the-gap components — Exercise UI for gap-fill interactions where users type missing words.

- **glossary**

  - `GlossaryText` / `GlossaryTooltip` / `GlossaryParagraph` / `GlossaryListItem` — Detects glossary words in text content and wraps them with tooltips or specialized HTML when rendering exercise/content text.

- **layout**

  - `Container` / `Row` / `Column` — Layout primitives used across the UI for consistent spacing and responsive content arrangement. See `layout/LAYOUT_COMPONENTS.md` for details.

- **learning-form**

  - `LearningForm` — Multi-step form component used for learning modules and feedback forms (e.g., exercise rating), with step selector and radio options.

- **linkbutton**

  - `LinkButton` — Next.js `Link` component styled using `Button` variants for navigation that looks like a button.

- **multichoice**

  - `Multichoice` / `RenderText` — Components to render multi-choice exercises, randomize options, and handle user submission/feedback.

- **navbar**

  - `Navbar` / `Navigation` — Top navigation bar and helper components for app-wide navigation and auth controls.

- **radio**

  - `Radio` — Custom radio input with styling and accessibility considerations. Used in forms and learning modules.

- **render-html**

  - `RenderHTML` — Safely parses HTML content and replaces custom tags (e.g., `glossaryparagraph`, `glossarylistitem`) with React components.

- **sidebar**
  - `Sidebar` — Page/section navigation side bar with admin controls (act-as dropdown for admins) and dynamic links to content/resources.
