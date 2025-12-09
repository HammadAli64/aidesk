import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Desk - AI News Dashboard",
  description: "Stay updated with the latest AI, LLM, and tech news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

