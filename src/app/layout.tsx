import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "../../auth";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EAP — Project & Task Collaboration",
  description: "Smart Project & Task Collaboration System",
};

// Blocking script — sets .dark class BEFORE paint to prevent FOUC
const themeScript = `
try {
  const t = localStorage.getItem('theme')
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
} catch (e) {}
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // read session server-side — no flash on hydration

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
