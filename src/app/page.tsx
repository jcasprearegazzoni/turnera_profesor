/**
 * Landing Page de CourtManager — /
 * Página pública con descripción del servicio y botones de registro.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misú — Gestión de turnos para profesores de Padel y Tenis",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 h-16 border-b border-border/50">
        <span className="font-bold text-lg text-primary">🎾 CourtManager</span>
        <div className="flex gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Ingresar
          </Button>
          <Button render={<Link href="/registro" />}>
            Registrarse
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl space-y-6">

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Gestioná tus clases de{" "}
            <span className="text-primary">Tenis</span> y{" "}
            <span className="text-primary">Pádel</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Organizá tu agenda, gestioná alumnos y controlá tus finanzas.
            Todo desde una sola app que tus alumnos pueden instalar en su celular.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              className="font-semibold text-base"
              render={<Link href="/registro" />}
            >
              Registrarse
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-base"
              render={<Link href="/login" />}
            >
              Ingresar
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/50 bg-card">
            <span className="text-3xl">📅</span>
            <h3 className="font-semibold">Turnos online</h3>
            <p className="text-sm text-muted-foreground text-center">
              Tus alumnos reservan directo desde su celular. Sin WhatsApp, sin confusiones.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/50 bg-card">
            <span className="text-3xl">💰</span>
            <h3 className="font-semibold">Control financiero</h3>
            <p className="text-sm text-muted-foreground text-center">
              Registrá cobros, creá paquetes de clases y sabé quién te debe.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/50 bg-card">
            <span className="text-3xl">📱</span>
            <h3 className="font-semibold">PWA instalable</h3>
            <p className="text-sm text-muted-foreground text-center">
              Se instala como app en el celular. Sin App Store, sin complicaciones.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 CourtManager. Hecho con 🎾 en Argentina.</p>
      </footer>
    </div>
  );
}
