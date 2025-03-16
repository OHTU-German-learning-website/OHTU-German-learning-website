import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container, Row, Column, layoutPropsRegistry } from "./container";

// Mock the breakpoints that seem to be missing in the provided code
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const breakpointsValues = Object.values(breakpoints);

// Mock React's useMemo to just execute the function
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useMemo: (fn) => fn(),
  };
});

describe("Container Component", () => {
  it("renders children correctly", () => {
    render(<Container>Test Content</Container>);
    expect(screen.getByText("Test Content")).toBeTruthy();
  });

  it("handles array breakpoints correctly", () => {
    const { container } = render(
      <Container p={["10px", "20px", "30px"]}>Content</Container>
    );
    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
    // Media queries would be tested in integration tests
  });

  it("handles object breakpoints correctly", () => {
    const { container } = render(
      <Container p={{ base: "10px", md: "20px", lg: "30px" }}>
        Content
      </Container>
    );

    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
  });

  it("handles fontSize correctly", () => {
    const { container } = render(
      <Container p="sm" fontSize="sm">
        Content
      </Container>
    );
    const div = container.firstChild;

    expect(div.style.fontSize).toBe("var(--font-sm)");
  });

  it("applies style props correctly", () => {
    const { container } = render(
      <Container p="10px" m="5px" w="100px" h="200px">
        Content
      </Container>
    );
    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
    expect(div.style.margin).toBe("5px");
    expect(div.style.width).toBe("100px");
    expect(div.style.height).toBe("200px");
  });

  it("ignores invalid props", () => {
    const { container } = render(
      <Container invalidProp="value" p="10px">
        Content
      </Container>
    );
    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
    expect(div.getAttribute("invalidProp")).toBeNull();
  });

  it("handles array breakpoints correctly", () => {
    const { container } = render(
      <Container p={["10px", "20px", "30px"]}>Content</Container>
    );
    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
    // Media queries would be tested in integration tests
  });

  it("handles object breakpoints correctly", () => {
    const { container } = render(
      <Container p={{ base: "10px", md: "20px", lg: "30px" }}>
        Content
      </Container>
    );
    const div = container.firstChild;

    expect(div.style.padding).toBe("10px");
    // Media queries would be tested in integration tests
  });
});

describe("Row Component", () => {
  it("renders with flex row direction", () => {
    const { container } = render(<Row>Row Content</Row>);
    const div = container.firstChild;

    expect(div.style.display).toBe("flex");
    expect(div.style.flexDirection).toBe("row");
    expect(screen.getByText("Row Content")).toBeTruthy();
  });

  it("applies additional props", () => {
    const { container } = render(
      <Row p="10px" justify="center">
        Row Content
      </Row>
    );
    const div = container.firstChild;

    expect(div.style.display).toBe("flex");
    expect(div.style.flexDirection).toBe("row");
    expect(div.style.padding).toBe("10px");
    expect(div.style.justifyContent).toBe("center");
  });
});

describe("Column Component", () => {
  it("renders with flex column direction", () => {
    const { container } = render(<Column>Column Content</Column>);
    const div = container.firstChild;

    expect(div.style.display).toBe("flex");
    expect(div.style.flexDirection).toBe("column");
    expect(screen.getByText("Column Content")).toBeTruthy();
  });

  it("applies additional props", () => {
    const { container } = render(
      <Column p="10px" align="center">
        Column Content
      </Column>
    );
    const div = container.firstChild;

    expect(div.style.display).toBe("flex");
    expect(div.style.flexDirection).toBe("column");
    expect(div.style.padding).toBe("10px");
    expect(div.style.alignItems).toBe("center");
  });
});

describe("layoutPropsRegistry", () => {
  it("contains all expected layout props", () => {
    expect(layoutPropsRegistry).toHaveProperty("p", "padding");
    expect(layoutPropsRegistry).toHaveProperty("w", "width");
    expect(layoutPropsRegistry).toHaveProperty("h", "height");
    expect(layoutPropsRegistry).toHaveProperty("display", "display");
    expect(layoutPropsRegistry).toHaveProperty("direction", "flexDirection");
  });
});
