"use client";
import styles from "./button.module.css";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  width,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={[
        styles.baseButton,
        styles[variant],
        styles[size],
        styles[width],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};
