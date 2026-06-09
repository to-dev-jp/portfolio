import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Takumi Okamoto's Portfolio",
  description:
    "フロントエンドエンジニア/デザイナーとして活動するTakumi Okamotoのポートフォリオサイト",
  icons: {
    icon: [
      {
        url: "/icon-black.png",
        href: "/icon-black.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
