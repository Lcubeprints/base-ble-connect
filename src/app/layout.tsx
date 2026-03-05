import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const ROOT_URL = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Chain Pulse",
  description: "Visualize your Base and Ethereum onchain activity",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${ROOT_URL}/hero.png`,
      button: {
        title: "View My Activity",
        action: {
          type: "launch_frame",
          name: "Chain Pulse",
          url: ROOT_URL,
          splashImageUrl: `${ROOT_URL}/splash.png`,
          splashBackgroundColor: "#0A0B0D",
        },
      },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#0A0B0D] antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
