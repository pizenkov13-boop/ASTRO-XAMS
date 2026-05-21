import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { AdlibPreloader } from "@/components/layout/AdlibPreloader";
import { NotificationScheduler } from "@/components/layout/NotificationScheduler";
import { ServiceWorkerBootstrap } from "@/components/layout/ServiceWorkerBootstrap";
import { SpotifyTokenHandoff } from "@/components/layout/SpotifyTokenHandoff";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "ASTRO'XAMS — Space-Powered Learning",
  description:
    "Grammar, vocabulary, and SAT prep with spaced repetition, quizzes, and dopamine ad-libs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <AdlibPreloader />
        <ServiceWorkerBootstrap />
        <NotificationScheduler />
        <SpotifyTokenHandoff />
        {children}
      </body>
    </html>
  );
}
