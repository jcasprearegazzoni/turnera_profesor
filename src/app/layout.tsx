import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "misu - Gestion de turnos para profes de Tenis y Padel",
    template: "%s | misu",
  },
  description:
    "Organiza tus clases, gestiona alumnos y controla tus finanzas. La app que todo profesor de Tenis y Padel necesita.",
  keywords: [
    "tenis",
    "padel",
    "turnos",
    "profesor",
    "clases",
    "argentina",
    "gestion",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
