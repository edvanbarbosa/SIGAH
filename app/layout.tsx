import type { Metadata } from "next";
import { Public_Sans, Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SIGAH",
  description: "Sistema Integrado de Gestão de Apoio Habitacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${publicSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
