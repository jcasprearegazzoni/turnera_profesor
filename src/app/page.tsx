import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "misu - Gestion de turnos para profesores de Padel y Tenis",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border/50 px-4 md:px-8">
        <span className="font-bold text-lg text-primary">misu</span>
        <div className="flex gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Ingresar
          </Button>
          <Button render={<Link href="/registro" />}>Registrarse</Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Gestiona tus clases de <span className="text-primary">Tenis</span> y{" "}
            <span className="text-primary">Padel</span>
          </h1>

          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Organiza tu agenda, gestiona alumnos y controla tus finanzas. Todo
            desde una sola app que tus alumnos pueden instalar en su celular.
          </p>

          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
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

        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
            <span className="text-3xl">Turnos</span>
            <h3 className="font-semibold">Turnos online</h3>
            <p className="text-center text-sm text-muted-foreground">
              Tus alumnos reservan directo desde su celular. Sin WhatsApp, sin confusiones.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
            <span className="text-3xl">Finanzas</span>
            <h3 className="font-semibold">Control financiero</h3>
            <p className="text-center text-sm text-muted-foreground">
              Registra cobros, crea paquetes de clases y sabe quien te debe.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6">
            <span className="text-3xl">PWA</span>
            <h3 className="font-semibold">PWA instalable</h3>
            <p className="text-center text-sm text-muted-foreground">
              Se instala como app en el celular. Sin App Store, sin complicaciones.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 misu. Hecho en Argentina.</p>
      </footer>
    </div>
  );
}
