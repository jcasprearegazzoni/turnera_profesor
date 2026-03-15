"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SignOutButton from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Profile } from "@/types/database";

const PROFESOR_NAV = [
  { href: "/profesor", label: "Dashboard", icon: "Tablero" },
  { href: "/profesor/turnos", label: "Turnos", icon: "Calendario" },
  { href: "/profesor/alumnos", label: "Alumnos", icon: "Personas" },
  { href: "/profesor/finanzas", label: "Finanzas", icon: "Pesos" },
  { href: "/profesor/perfil", label: "Mi Perfil", icon: "Usuario" },
];

const ALUMNO_NAV = [
  { href: "/alumno", label: "Dashboard", icon: "Tablero" },
  { href: "/alumno/reservar", label: "Reservar", icon: "Calendario" },
  { href: "/alumno/mis-clases", label: "Mis Clases", icon: "Pelota" },
  { href: "/alumno/perfil", label: "Mi Perfil", icon: "Usuario" },
];

interface DashboardNavbarProps {
  profile: Profile;
}

export default function DashboardNavbar({ profile }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = profile.role === "profesor" ? PROFESOR_NAV : ALUMNO_NAV;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="sm" className="mr-2 md:hidden">
                <span className="text-lg">☰</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64">
            <SheetTitle className="font-bold text-primary">misu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href={profile.role === "profesor" ? "/profesor" : "/alumno"}
          className="mr-6 font-bold text-primary"
        >
          misu
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {profile.name || "Usuario"}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
