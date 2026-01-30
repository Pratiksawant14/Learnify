import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalSidebar from "@/components/shared/ConditionalSidebar";
import ConditionalLayout from "@/components/shared/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learnify - Learn Anything, Anywhere",
  description: "AI-powered learning course generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <ConditionalSidebar />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
