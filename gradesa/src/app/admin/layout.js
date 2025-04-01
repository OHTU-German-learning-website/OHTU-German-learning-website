"use client";

import styles from "./admin-layout.module.css";
import { useIsAdmin } from "@/context/user.context";

export default function AdminLayout({ children }) {
  const isAdmin = useIsAdmin();

  const renderAdminContent = () => {
    switch (isAdmin) {
      case true:
        return children;
      case false:
        return <span>Unauthorized</span>;
      default:
        return <span>Loading...</span>;
    }
  };
  return <div className={styles.adminLayout}>{renderAdminContent()}</div>;
}
