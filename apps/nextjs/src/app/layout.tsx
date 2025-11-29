import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@sassy/ui/theme";
import { Toaster } from "@sassy/ui/toast";
import { cn } from "@sassy/ui/utils";

import AppHeader from "~/app/_components/app-header";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";
import { HowItWorksDrawer } from "./_components/how-it-works-drawer";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://engagekit.io"
      : env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : "http://localhost:3000",
  ),
  title: "Gifavatar",
  description: "Create animated avatars and lovable landing pages with AI",
  openGraph: {
    title: "Gifavatar",
    description: "Create animated avatars and lovable landing pages with AI",
    url: "https://gifavatar.app",
    siteName: "Gifavatar",
    images: [
      {
        url: "/preview-meta.png",
        width: 1200,
        height: 630,
        alt: "Gifavatar preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gifavatar",
    creator: "@knam_nguyen",
    images: ["/preview-meta.png"],
  },
  icons: {
    icon: "/favikon.ico",
    shortcut: "/favikon.ico",
    apple: "/favikon.ico",
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          plusJakartaSans.variable,
        )}
      >
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider attribute="class" defaultTheme="light">
            <TRPCReactProvider>
              <AppHeader />
              {props.children}
              <HowItWorksDrawer />
            </TRPCReactProvider>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
