/**
 * Navbar del dashboard.
 * Muestra el logo, nombre del usuario, y botón de cerrar sesión.
 * Incluye navegación mobile con Sheet (hamburger menu).
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import type { Profile } from "@/types/database";

// Navegación del profesor
const PROFESOR_NAV = [
  { href: "/profesor", label: "Dashboard", icon: "📊" },
  { href: "/profesor/turnos", label: "Turnos", icon: "📅" },
  { href: "/profesor/alumnos", label: "Alumnos", icon: "👥" },
  { href: "/profesor/finanzas", label: "Finanzas", icon: "💰" },
  { href: "/profesor/perfil", label: "Mi Perfil", icon: "👤" },
];

// Navegación del alumno
const ALUMNO_NAV = [
  { href: "/alumno", label: "Dashboard", icon: "🏠" },
  { href: "/alumno/reservar", label: "Reservar", icon: "📅" },
  { href: "/alumno/mis-clases", label: "Mis Clases", icon: "🎾" },
  { href: "/alumno/perfil", label: "Mi Perfil", icon: "👤" },
];

interface DashboardNavbarProps {
  profile: Profile;
}

export default function DashboardNavbar({ profile }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Seleccionar la navegación según el rol
  const navItems = profile.role === "profesor" ? PROFESOR_NAV : ALUMNO_NAV;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Hamburger menu (mobile) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="sm" className="md:hidden mr-2">
                <span className="text-lg">☰</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64">
            <SheetTitle className="text-primary font-bold">
              🎾 CourtManager
            </SheetTitle>
            <nav className="flex flex-col gap-1 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href={profile.role === "profesor" ? "/profesor" : "/alumno"} className="font-bold text-primary mr-6">
          🎾 CourtManager
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Usuario + Sign out */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {profile.name || "Usuario"}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
