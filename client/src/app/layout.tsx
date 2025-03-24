import type { Metadata } from "next";
import { Press_Start_2P, Exo_2, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { Toaster } from "@/components/ui/sonner";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "swap",
  variable: '--font-press-start',
});

const exo2 = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-exo2',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "HypeHub",
  description: "HypeHub is a gamified productivity application built with Next.js that turns your daily tasks into an exciting adventure. Complete goals, gain experience, and watch your character grow",
  icons: {
    icon: "/favicon2.png",
    
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.className} ${exo2.variable} ${spaceGrotesk.variable}`}>
        <WebSocketProvider>
        <div className="mx-auto overflow-hidden">
          {children}
          <Toaster richColors />
        </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}
