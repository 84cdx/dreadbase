import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DREADBASE // CLASSIFIED MEDIA ARCHIVE",
  description: "Secure database for horror-themed cinematic and interactive intelligence.",
};

import { Header, TopNavItem } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const TOP_NAV_ITEMS: TopNavItem[] = [
  { id: "home", label: "HOME", href: "/" },
  { id: "vault", label: "VAULT", href: "/vault" },
  { id: "mylist", label: "MY LIST", href: "/mylist" },
  { id: "social", label: "SOCIAL", href: "/social" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden"
        suppressHydrationWarning
      >
        <Header logoText="DREADBASE" navItems={TOP_NAV_ITEMS} searchPlaceholder="SEARCH..." />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
