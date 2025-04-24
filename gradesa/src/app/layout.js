import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import Navbar from "@/components/ui/navbar/navigation";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { UserProvider } from "@/context/user.context";
import { GlossaryProvider } from "@/context/glossary.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gradesa",
  description: "Gradesa — deutsch lernen",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="tooltip-portal" />
        <UserProvider>
          <GlossaryProvider>
            <Navbar />
            <div className={styles.sidebarMain}>
              <Sidebar />
              <main className={styles.main}>{children}</main>
            </div>
          </GlossaryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
