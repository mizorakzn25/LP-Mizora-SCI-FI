import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Orbitron, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mizora KZN | AI Workflow & System Builder",
  description: "Premium AI Workflow & System Builder. Mizora KZN delivers elite cybernetic orchestration, visual direction, and enterprise-grade digital production.",
  keywords: ["Mizora KZN", "AI Workflow", "System Builder", "Cybernetic", "Enterprise", "Visual Direction", "Creative Orchestration"],
  icons: {
    icon: "/images/mizora-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="loading-active" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} ${orbitron.variable} ${zenKakuGothicNew.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
