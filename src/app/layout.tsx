import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Analyze your Chess Game",
    description:
        "This website aims to analyze your chess game using stockfish engine for free.",
    publisher: "Tausiq Samantaray",
    keywords: [
        "chess",
        "analysis",
        "stockfish",
        "Tausiq Samantaray",
        "chess analysis for free",
    ],
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    );
}
