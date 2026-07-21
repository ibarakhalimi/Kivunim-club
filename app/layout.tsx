import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import SwRegister from "./sw-register";   // ← add this
import { RouteTransition } from "./route-transition";
import { AuthErrorCatcher } from "./auth-error-catcher";

export const metadata: Metadata = {
  title: "כיוונים · מועדון הסטודנטים",
  description: "אפליקציית המועדון הסטודנטיאלי — עדכונים, אירועים, הטבות וסקרים.",
};

export const viewport: Viewport = {
  themeColor: "#090B12",
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
        <Suspense fallback={null}>
          <AuthErrorCatcher />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
