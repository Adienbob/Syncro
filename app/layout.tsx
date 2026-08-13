
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { AppProvider } from "./state/AppContext";

export const metadata: Metadata = {
  title: {
    default: "Syncro",
    template: "%s | Syncro",
  },
  description:
    "Syncro is a collaborative Kanban task management platform for organizing boards, tasks, and team members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en" className="h-full antialiased">
          <body className="h-full bg-surface-lowest">
              <AppProvider>{children}</AppProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}

