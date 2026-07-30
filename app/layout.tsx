import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/header.css";
import "@/styles/footer.css";
import "@/styles/search-modal.css"; // Global level import
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prasad AI Prompt",
    template: "%s | Prasad AI Prompt",
  },
  description:
    "Discover premium AI prompts for ChatGPT, Gemini and more.",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  keywords: [
    "AI Prompts",
    "ChatGPT Prompts",
    "Travel Prompts",
    "Trending Prompts",
    "Gemini Prompts",
    "Prasad AI",
  ],
  authors: [
    {
      name: "Prasad AI",
    },
  ],
  creator: "Prasad AI",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Prasad AI Prompt",
    description:
      "Discover premium AI prompts for ChatGPT, Gemini and more.",
    type: "website",
    siteName: "Prasad AI Prompt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prasad AI Prompt",
    description:
      "Discover premium AI prompts for ChatGPT, Gemini and more.",
  },
  manifest: "/manifest.json",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
  <body style={{ margin: 0, padding: 0}}>
    {children}
  </body>
</html>
  );
}