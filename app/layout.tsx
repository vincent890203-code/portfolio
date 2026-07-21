import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { PROFILE } from "@/content/profile";
import AnalyticsProvider from "@/components/AnalyticsProvider.client";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const title = `${PROFILE.name}(${PROFILE.nameEn})· ${PROFILE.headline}`;
const description = PROFILE.tagline;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "郭原辰",
    "Yuan-Chen Kuo",
    "AI Systems Engineer",
    "LLM Engineer",
    "Software Architect",
    "轉職",
    "分子醫學",
    "RAG",
    "多代理系統",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={notoSansTC.variable}>
      <body className="font-sans">
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
