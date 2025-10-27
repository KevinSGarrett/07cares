import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
// If your starter has a global stylesheet, uncomment the next line
// import "./globals.css";

export const metadata = {
  title: "07.Cares",
  description: "Crowdfunding for good",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
