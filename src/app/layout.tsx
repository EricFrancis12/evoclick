import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientToaster from "../components/ClientToaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EvoClick",
    description: "The best things in my life have come from other people",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientToaster />
                {children}
            </body>
        </html>
    )
}
