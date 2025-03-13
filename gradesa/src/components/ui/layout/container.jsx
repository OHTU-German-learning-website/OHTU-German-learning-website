import { memo, useMemo } from "react";

export const layoutPropsRegistry = {
  all: "all",
  position: "position",
  display: "display",
  overflow: "overflow",
  overflowX: "overflowX",
  overflowY: "overflowY",
  direction: "flexDirection",
  justify: "justifyContent",
  align: "alignItems",
  justifyItems: "justifyItems",
  alignContent: "alignContent",
  alignSelf: "alignSelf",
  justifySelf: "justifySelf",
  columnGap: "columnGap",
  rowGap: "rowGap",
  wrap: "flexWrap",
  basis: "flexBasis",
  grow: "flexGrow",
  shrink: "flexShrink",
  templateColumns: "gridTemplateColumns",
  templateRows: "gridTemplateRows",
  autoFlow: "gridAutoFlow",
  gridRow: "gridRow",
  gridColumn: "gridColumn",
  gridTemplate: "gridTemplate",
  gridTemplateAreas: "gridTemplateAreas",
  b: "border",
  borderStyle: "borderStyle",
  borderColor: "borderColor",
  opacity: "opacity",
  p: "padding",
  pt: "paddingTop",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  m: "margin",
  br: "borderRadius",
  m: "margin",
  mt: "marginTop",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  w: "width",
  h: "height",
  r: "borderRadius",
  z: "zIndex",
  minH: "minHeight",
  minW: "minWidth",
  maxH: "maxHeight",
  maxW: "maxWidth",
  top: "top",
  left: "left",
  bottom: "bottom",
  right: "right",
  order: "order",
  fontSize: "fontSize",
  borderWidth: "borderWidth",
  gap: "gap",
  bg: "backgroundColor",
};

export const breakpoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "1080px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "1920px",
};

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

const breakpointsValues = Object.values(breakpoints);

const getValue = (cssProp, value) => {
  if (sizes.includes(value)) {
    switch (cssProp) {
      case "fontSize":
        return `var(--font-${value})`;
      case "margin":
      case "borderRadius":
        return `var(--radius-${value})`;
      case "borderWidth":
        return `var(--border-width-${value})`;
      default:
        return `var(--u-${value})`;
    }
  }
  return value;
};

export const Container = memo(({ children, className, ...props }) => {
  const mediaQueries = {};

  const validLayoutPropsEntries = useMemo(
    () =>
      Object.entries(props).filter(([k, v]) => k in layoutPropsRegistry && !!v),
    [props]
  );

  const style = useMemo(() => {
    return {
      ...Object.fromEntries(
        validLayoutPropsEntries.map(([alias, propValue]) => {
          const cssProp = layoutPropsRegistry[alias];

          let base;
          if (Array.isArray(propValue)) {
            // breakpoints (Array syntax)
            if (
              propValue.length > breakpointsValues.length + 1 ||
              propValue.length === 0
            ) {
              throw new Error(`Invalid breakpoint array length`);
            }

            propValue.forEach((value, i) => {
              if (i === 0) return;
              // aggregate media queries
              const query = `@media(min-width: ${breakpointsValues[i - 1]})`;
              mediaQueries[query] = {
                ...mediaQueries[query],
                [cssProp]: getValue(cssProp, value),
              };
            });

            base = getValue(cssProp, propValue[0]);
          } else if (typeof propValue === "object") {
            // breakpoints (Object syntax)
            if (!("base" in propValue)) {
              throw new Error(`Required key: 'base' is missing`);
            }
            for (const [key, value] of Object.entries(propValue)) {
              if (key !== "base" && !(key in breakpoints)) {
                throw new Error(`Invalid breakpoint: ${key}`);
              } else if (key in breakpoints) {
                // aggregate media queries
                const bpValue = breakpoints[key];
                const query = `@media(min-width: ${bpValue})`;
                mediaQueries[query] = {
                  ...mediaQueries[query],
                  [cssProp]: getValue(cssProp, value),
                };
              }
            }

            base = getValue(cssProp, propValue.base);
          } else {
            base = getValue(cssProp, propValue);
          }
          return [cssProp, base];
        })
      ),
      // spread aggregated media queries
      ...mediaQueries,
    };
  }, [validLayoutPropsEntries]);
  console.log(style);
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
});

export const Row = memo(({ children, ...props }) => {
  return (
    <Container {...props} display="flex" direction="row">
      {children}
    </Container>
  );
});

export const Column = memo(({ children, ...props }) => {
  return (
    <Container {...props} display="flex" direction="column">
      {children}
    </Container>
  );
});
