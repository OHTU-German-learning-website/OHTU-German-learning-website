"use client";
import styles from "./dropdown.module.css";

export const Dropdown = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};
