import type { Metadata, Viewport } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "درة الشعر",
  description: "كتاب شعر تفاعلي بتجربة تقليب الصفحات",
};

export const viewport: Viewport = { themeColor: "#1c0f06" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={amiri.variable}>
      <head>
        <meta name="apple-mobile-web-app-title" content="درة الشعر" />
      </head>
      <body>{children}</body>
    </html>
  );
}
