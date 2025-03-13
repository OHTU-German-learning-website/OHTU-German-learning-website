# Layout Components Documentation

This document provides an overview and usage examples for the layout components: Container, Row, and Column.

## Container Component

The `Container` component is a flexible container that accepts a range of layout properties. It converts prop aliases (such as `p` for padding, `w` for width, etc.) into corresponding CSS styles applied inline. It also supports responsive styling using both array and object syntaxes for breakpoints.

### Key Features

- Maps shorthand layout props to standard CSS properties.
- Supports responsive design via:
  - **Array Syntax:** The first element is applied as the base style, and additional elements correspond to increasing breakpoints.
  - **Object Syntax:** Requires a `base` key, with other keys representing designated breakpoints (e.g., `sm`, `md`, `lg`, etc.).
- Aggregates media query styles dynamically and merges them into the inline style object.

### Example Usage (Container)

Basic usage:

```jsx
import { Container } from "./container";

function BasicExample() {
  return (
    <Container p="10px" w="200px" h="100px">
      Basic Container
    </Container>
  );
}
```

Responsive usage with Array syntax:

```jsx
import { Container } from "./container";

function ResponsiveArrayExample() {
  return (
    <Container p={["8px", "12px", "16px"]}>
      Responsive Container (Array Syntax)
    </Container>
  );
}
```

Responsive usage with Object syntax:

```jsx
import { Container } from "./container";

function ResponsiveObjectExample() {
  return (
    <Container p={{ base: "8px", md: "12px", lg: "16px" }}>
      Responsive Container (Object Syntax)
    </Container>
  );
}
```

## Row and Column Components

The `Row` and `Column` components extend the `Container` to simplify common flexbox layout patterns.

### Row Component

The `Row` component renders a flex container with `flexDirection` set to `row`. It accepts additional layout props like padding, margin, and alignment.

Example:

```jsx
import { Row } from "./container";

function RowExample() {
  return (
    <Row p="20px" justify="center">
      Row Content
    </Row>
  );
}
```

### Column Component

The `Column` component renders a flex container with `flexDirection` set to `column`. It supports the same props as `Container` for flexible layout management.

Example:

```jsx
import { Column } from "./container";

function ColumnExample() {
  return (
    <Column p="15px" align="center">
      Column Content
    </Column>
  );
}
```

### CSS Variable Sizes and Responsive Values

The Container component supports both raw CSS values (e.g., "10px", "1rem") and predefined CSS variable sizes for consistent styling. When you supply a size keyword (one of: xs, sm, md, lg, xl, 2xl, 3xl), it is converted into a corresponding CSS variable according to the mappings defined in container.jsx and your global CSS.

CSS variable resolution works as follows:

• For the fontSize prop:

- A size such as "sm" is transformed to "var(--font-sm)".

• For spacing and sizing props (e.g., padding (p), width (w), height (h), gap, etc.):

- Sizes are mapped to "var(--u-[size])". For example, p="lg" becomes "var(--u-lg)".

• For margin (m) and borderRadius (br or r):

- Sizes are resolved to "var(--radius-[size])".

The component also supports responsive values using two syntaxes:

Using CSS variable sizes ensures consistency in spacing, sizing, and typography across your UI. For example:

    <Container fontSize="md" p="lg">
      Using CSS variable sizes for consistent theming
    </Container>

Refer to container.jsx and globals.css for the complete details on how size keywords are mapped to CSS variables.
