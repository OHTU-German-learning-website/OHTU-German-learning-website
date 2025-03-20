import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import Navbar from "@/components/ui/navbar/navigation";
import Sidebar from "@/components/ui/sidebar/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className={styles.sidebarMain}>
          <Sidebar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
