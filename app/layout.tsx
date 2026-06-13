import type { Metadata } from "next";
import { Noto_Sans_KR, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareChurch | 늘사랑 목회돌봄 관리 시스템",
  description: "늘사랑교회 목회돌봄 관리 시스템입니다.",
  openGraph: {
    title: "CareChurch | 늘사랑 목회돌봄 관리 시스템",
    description: "늘사랑교회 목회돌봄 관리 시스템입니다.",
    url: "https://neulsarang.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${dmSerif.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>{children}</body>
    </html>
  );
}
