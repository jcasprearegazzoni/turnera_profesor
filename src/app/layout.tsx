import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Tipografía Inter como fuente principal
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Metadata de la aplicación — SEO
export const metadata: Metadata = {
  title: {
    default: "CourtManager — Gestión de turnos para profes de Tenis y Pádel",
    template: "%s | CourtManager",
  },
  description:
    "Organizá tus clases, gestioná alumnos y controlá tus finanzas. La app que todo profesor de Tenis y Pádel necesita.",
  keywords: [
    "tenis",
    "pádel",
    "turnos",
    "profesor",
    "clases",
    "argentina",
    "gestión",
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
        {/* Notificaciones toast globales */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
