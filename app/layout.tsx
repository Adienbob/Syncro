import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { AppProvider } from "./state/AppContext";

export const metadata: Metadata = {
  title: {
    default: "Syncro | Collaborative Task Management",
    template: "%s | Syncro",
  },

  description:
    "Syncro is a collaborative Kanban task management platform for creating boards, organizing tasks, tracking progress, and collaborating with your team.",

  keywords: [
    // English
    "task management",
    "kanban",
    "kanban board",
    "project management",
    "team collaboration",
    "task tracking",
    "productivity app",
    "collaborative workspace",
    "task organizer",
    "project tracking",
    "team task management",
    "online task manager",
    "work management",
    "Syncro",

    // Arabic
    "إدارة المهام",
    "تنظيم المهام",
    "إدارة المشاريع",
    "إدارة فرق العمل",
    "تعاون الفريق",
    "لوحة كانبان",
    "كانبان",
    "تتبع المهام",
    "تنظيم العمل",
    "إدارة العمل",
    "إدارة المشاريع والمهام",
    "برنامج إدارة المهام",
    "تطبيق إدارة المهام",
    "منصة إدارة المهام",
    "إدارة المهام للفرق",
    "زيادة الإنتاجية",
    "تنظيم المشاريع",
    "Syncro",
  ],

  applicationName: "Syncro",

  authors: [
    {
      name: "Hussien Walid",
    },
  ],

  creator: "Hussien Walid",

  category: "Productivity",

  openGraph: {
    title: "Syncro | Collaborative Task Management",
    description:
      "Organize boards, manage tasks, track progress, and collaborate with your team using Syncro.",
    type: "website",
    siteName: "Syncro",
  },

  twitter: {
    card: "summary_large_image",
    title: "Syncro | Collaborative Task Management",
    description:
      "Organize boards, manage tasks, track progress, and collaborate with your team using Syncro.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
        <Analytics />
    </ClerkProvider>
  );
}

