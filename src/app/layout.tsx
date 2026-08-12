import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReferrerTracker } from "@/components/ReferrerTracker";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stopme — Not Just a Rakhi. A Memory They Can Keep Forever.",
  description:
    "A beautifully crafted 3D printed NFC Rakhi that unlocks your most meaningful moments with just one tap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative">
        <ReferrerTracker />
        {children}
      </body>
    </html>
  );
}
