import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalcVerse - Interactive Animated Calculator Game",
  description: "Solve math challenges with an interactive animated calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
