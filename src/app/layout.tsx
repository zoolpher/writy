import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import "tldraw/tldraw.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Writy - Collaborative Whiteboard",
  description: "A real-time collaborative whiteboard built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ClerkProvider must be inside body in the newest version of Clerk */}
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
