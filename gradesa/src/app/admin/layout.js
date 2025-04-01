"use client";

import styles from "./admin-layout.module.css";
import { useAdminGuard } from "@/context/user.context";

export default function AdminLayout({ children }) {
  useAdminGuard();

  // Only render children if user is logged in and acting as admin
  return <div className={styles.adminLayout}>{children}</div>;
}
