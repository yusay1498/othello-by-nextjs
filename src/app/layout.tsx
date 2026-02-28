import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "オセロ",
  description:
    "ブラウザで遊べるオセロ（リバーシ）ゲーム。合法手判定や石の自動反転、スコア表示に対応した Next.js 製のWebアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
