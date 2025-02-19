"use client";
import styles from "./button.module.css";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  width,
  ...props
}) => {
  console.log(styles);
  return (
    <button
      {...props}
      className={[
        styles.baseButton,
        styles[variant],
        styles[size],
        styles[width],
        props.className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};
