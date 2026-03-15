/**
 * Dashboard del Alumno — /alumno
 * Página principal con próxima clase, paquetes activos, y botón de reserva.
 * Por ahora es un placeholder — se completará en módulos posteriores.
 */
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Alumno",
};

export default async function AlumnoDashboard() {
  const supabase = await createClient();

  // Obtener perfil del alumno
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold">
          ¡Hola, {profile?.name || "Alumno"}! 🎾
        </h1>
        <p className="text-muted-foreground">
          ¿Listo para tu próxima clase?
        </p>
      </div>

      {/* Botón grande de reservar */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-col items-center py-8 gap-4">
          <span className="text-4xl">🎾</span>
          <h2 className="text-lg font-semibold">Reservá tu próxima clase</h2>
          <p className="text-sm text-muted-foreground text-center">
            Buscá un profesor y elegí el horario que más te guste
          </p>
          <Button
            size="lg"
            className="font-semibold"
            render={<Link href="/alumno/reservar" />}
          >
            Reservar clase
          </Button>
        </CardContent>
      </Card>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Próxima clase</CardDescription>
            <CardTitle className="text-lg">Sin clases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Reservá una clase para verla acá
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clases restantes</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              En tu paquete activo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de clases</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Clases tomadas hasta ahora
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
