import type { Metadata } from "next";
import "./globals.css";
import SwRegister from "./sw-register";   // ← add this
import { RouteTransition } from "./route-transition";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SwRegister />   {/* ← add this */}
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
