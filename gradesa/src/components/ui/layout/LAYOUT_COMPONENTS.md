# Layout Components

_Last Updated: November 30, 2025_

This document provides an overview and usage examples for the layout components: `Container`, `Row`, and `Column`.

## Overview

These components provide a flexible, responsive layout system built on CSS Flexbox/Grid with shorthand props and breakpoint utilities.

**Import from:**

```javascript
import { Container, Row, Column } from "@/components/ui/layout/container";
```

## Container Component

The `Container` component is a flexible container that accepts a range of layout properties. It converts prop aliases (such as `p` for padding, `w` for width, etc.) into corresponding CSS styles applied inline.

### Key Features

- **Shorthand Props**: Maps aliases to CSS properties (e.g., `p` → `padding`, `w` → `width`).
- **Responsive Design**: Supports array and object syntax for breakpoint-based styling.
- **CSS Variable Integration**: Predefined size tokens (`xs`, `sm`, `md`, etc.) map to CSS variables.
- **Polymorphic**: Renders as different HTML elements via `as` prop (defaults to `div`).
- **Dynamic Styles**: Generates inline styles and media queries at runtime.

### Responsive Breakpoints

| Breakpoint | Min Width | Typical Device           |
| ---------- | --------- | ------------------------ |
| `xs`       | 480px     | Small phones (landscape) |
| `sm`       | 576px     | Large phones             |
| `md`       | 768px     | Tablets                  |
| `lg`       | 1080px    | Laptops                  |
| `xl`       | 1280px    | Desktops                 |
| `2xl`      | 1536px    | Large desktops           |
| `3xl`      | 1920px    | Ultra-wide displays      |

### Responsive Syntax

#### Array Syntax

Values map to breakpoints in order: base, then `xs`, `sm`, `md`, etc.

```javascript
// First value = base (mobile-first), subsequent = breakpoints
<Container p={["8px", "12px", "16px", "20px"]}>
  {/* Base: 8px, xs: 12px, sm: 16px, md: 20px */}
</Container>
```

#### Object Syntax

Explicit breakpoint keys. Requires `base` key.

```javascript
<Container p={{ base: "8px", md: "16px", xl: "24px" }}>
  {/* Base: 8px, md: 16px, xl: 24px */}
</Container>
```

### Example Usage

#### Basic Container

```jsx
import { Container } from "@/components/ui/layout/container";

function BasicExample() {
  return (
    <Container p="10px" w="200px" h="100px" bg="#eef2ff">
      Basic Container
    </Container>
  );
}
```

#### Responsive Array Syntax

```jsx
import { Container } from "@/components/ui/layout/container";

function ResponsiveArrayExample() {
  return (
    <Container p={["8px", "12px", "16px"]} w={["100%", "80%", "60%"]}>
      Responsive Container (Array Syntax)
    </Container>
  );
}
```

#### Responsive Object Syntax

```jsx
import { Container } from "@/components/ui/layout/container";

function ResponsiveObjectExample() {
  return (
    <Container p={{ base: "8px", md: "12px", lg: "16px" }}>
      Responsive Container (Object Syntax)
    </Container>
  );
}
```

#### Using CSS Variable Sizes

```jsx
import { Container } from "@/components/ui/layout/container";

function CSSVariableExample() {
  return (
    <Container fontSize="md" p="lg" m="sm" br="md">
      Using CSS variable sizes for consistent theming
    </Container>
  );
}
```

### Polymorphic `as` Prop

Render different semantic elements:

```jsx
<Container as="section" p="20px">Renders as section</Container>
<Container as="article" p="10px">Renders as article</Container>
```

## Row and Column Components

`Row` and `Column` extend `Container` with preset flex direction and helpful defaults.

### Row Component

Horizontal flex container (`flexDirection: row`).

```jsx
import { Row } from "@/components/ui/layout/container";

function RowExample() {
  return (
    <Row p="20px" justify="space-between" align="center" gap="10px">
      <div>Left</div>
      <div>Center</div>
      <div>Right</div>
    </Row>
  );
}
```

### Column Component

Vertical flex container (`flexDirection: column`).

```jsx
import { Column } from "@/components/ui/layout/container";

function ColumnExample() {
  return (
    <Column p="15px" align="center" gap="10px">
      <div>Top</div>
      <div>Middle</div>
      <div>Bottom</div>
    </Column>
  );
}
```

## Prop Reference

Complete list of commonly used props and their CSS mappings.

### Layout Props

| Prop       | CSS Property | Example               |
| ---------- | ------------ | --------------------- |
| `position` | `position`   | `position="relative"` |
| `display`  | `display`    | `display="flex"`      |
| `overflow` | `overflow`   | `overflow="hidden"`   |

### Flexbox Props

| Prop        | CSS Property     | Example              |
| ----------- | ---------------- | -------------------- |
| `direction` | `flexDirection`  | `direction="column"` |
| `justify`   | `justifyContent` | `justify="center"`   |
| `align`     | `alignItems`     | `align="center"`     |
| `wrap`      | `flexWrap`       | `wrap="wrap"`        |
| `gap`       | `gap`            | `gap="10px"`         |

### Spacing & Sizing

| Prop                           | CSS Property | Example                |
| ------------------------------ | ------------ | ---------------------- |
| `p`, `pt`, `pb`, `pl`, `pr`    | padding\*    | `p="10px"` or `p="lg"` |
| `m`, `mt`, `mb`, `ml`, `mr`    | margin\*     | `m="1rem"`             |
| `w`                            | width        | `w="100%"`             |
| `h`                            | height       | `h="50px"`             |
| `minW`, `maxW`, `minH`, `maxH` | sizing       | `minW="200px"`         |

(\* accepts raw values or CSS variable tokens like `sm`, `md`, `lg`)

### Border & Appearance

| Prop       | CSS Property   | Example              |
| ---------- | -------------- | -------------------- |
| `b`        | `border`       | `b="1px solid #000"` |
| `br` / `r` | `borderRadius` | `br="md"`            |
| `bg`       | `background`   | `bg="#fff"`          |
| `color`    | `color`        | `color="#333"`       |
| `fontSize` | `fontSize`     | `fontSize="md"`      |

## CSS Variable Sizes

Predefined tokens map to CSS variables declared in `globals.css`.

Examples:

```javascript
fontSize = "md"; // → var(--font-md)
p = "lg"; // → var(--u-lg)
br = "sm"; // → var(--radius-sm)
```

## Accessibility

Use semantic `as` prop and proper ARIA attributes for interactive containers.

```jsx
<Container as="nav">Navigation</Container>
<Container as="button" role="button" aria-label="Close">X</Container>
```

## Best Practices

1. Use semantic HTML via the `as` prop where appropriate.
2. Prefer mobile-first responsive styles (use base then breakpoints).
3. Use CSS variable tokens for consistent spacing and typography.
4. Avoid over-nesting; flatten layout when possible.
5. Use object syntax for explicit breakpoint rules in complex layouts.

## Performance Notes

- The `Container` implementation uses `memo()` and `useMemo()` to avoid unnecessary recalculation of inline styles.
- Avoid passing new object/array references on every render for responsive props.

Refer to the implementation in the layout source (e.g. `components/ui/layout/container.*`) for the exact prop registry and breakpoint values.
