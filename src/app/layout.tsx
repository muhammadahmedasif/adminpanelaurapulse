import type { Metadata } from "next";
import { Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken-grotesk" });

export const metadata: Metadata = {
  title: "AuraPulse Admin",
  description: "AuraPulse Clinical Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${hankenGrotesk.variable} antialiased bg-[#0b0f10] text-[#e0e3e4]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
