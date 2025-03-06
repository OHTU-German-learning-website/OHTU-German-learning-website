"use client";
import styles from "./box.module.css";

export const Box = ({
  children,
  variant = "primary",
  size = "md",
  width,
  className,
  ...props
}) => {
  return (
    <box
      {...props}
      className={[
        styles.baseBox,
        ,
        styles[variant],
        styles[size],
        styles[width],
        className,
      ].join(" ")}
    >
      {children}
    </box>
  );
};
