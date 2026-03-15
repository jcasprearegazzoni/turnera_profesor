/**
 * Botón para cerrar sesión.
 * Client Component porque necesita manejar el click y estado de carga.
 */
"use client";

import { useState } from "react";
import { cerrarSesion } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    try {
      await cerrarSesion();
    } catch {
      // La redirección lanza un error técnico — es esperado
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-muted-foreground hover:text-foreground"
    >
      {isLoading ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
