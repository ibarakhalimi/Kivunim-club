import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Rubik } from "next/font/google";
import "./globals.css";
import SwRegister from "./sw-register";   // ← add this

const displayFont = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const bodyFont = Rubik({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "כיוונים · מועדון הסטודנטים",
  description: "אפליקציית המועדון הסטודנטיאלי — עדכונים, אירועים, הטבות וסקרים.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SwRegister />   {/* ← add this */}
        {children}
      </body>
    </html>
  );
}