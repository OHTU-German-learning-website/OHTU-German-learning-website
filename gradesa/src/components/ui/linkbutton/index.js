"use client";
import Link from "next/link";
import styles from "@/components/ui/button/button.module.css";

export const LinkButton = ({
  href,
  children,
  variant = "outline",
  size = "md",
  width = "fit",
  className,
}) => {
  const classes = [
    styles.baseButton,
    styles[variant],
    styles[size],
    styles[width],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      className={classes}
      style={{ display: "inline-block", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};
