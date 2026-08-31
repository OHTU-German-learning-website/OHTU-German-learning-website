"use client";
import Link from "next/link";
import styles from "@/components/ui/button/button.module.css";
import { withBasePath } from "@/shared/utils/basePath";

export const LinkButton = ({
  href,
  children,
  variant = "outline",
  size = "md",
  width = "fit",
  className,
  hardNavigation = false,
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
  const style = { display: "inline-block", textDecoration: "none" };

  // Bypass Next.js soft-navigation (RSC fetch) for pages whose HTML may be too
  // large to stream reliably, avoiding client-side crashes on partial responses.
  // next/link auto-prefixes basePath; a plain <a> does not, so add it manually.
  if (hardNavigation) {
    return (
      <a href={withBasePath(href)} className={classes} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={style}>
      {children}
    </Link>
  );
};
