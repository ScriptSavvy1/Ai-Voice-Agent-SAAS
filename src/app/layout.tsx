import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "VoiceDesk AI — AI Voice Receptionist Platform",
  description:
    "Deploy an AI voice receptionist that answers calls, books appointments, and captures leads — 24/7. Works for any business, any industry.",
  keywords: [
    "AI voice agent",
    "voice receptionist",
    "appointment booking",
    "AI SaaS",
    "customer service",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
