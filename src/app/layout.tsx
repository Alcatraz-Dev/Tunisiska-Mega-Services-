import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tunsiska Mega Services – Shipping, Taxi, Cleaning & More",
  description:
    "Tunsiska Mega Services offers premium shipping, taxi, cleaning, and container logistics services connecting Sweden and Tunisia.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background-dark text-white overflow-x-hidden`}
      >
        <SettingsProvider>
          <LanguageProvider>
            <NavbarWrapper />
            <main className="grow pt-20">{children}</main>
            <FooterWrapper />
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
