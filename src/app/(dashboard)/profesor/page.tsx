/**
 * Dashboard del Profesor — /profesor
 * Página principal con resumen de turnos, ingresos y alumnos.
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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Profesor",
};

export default async function ProfesorDashboard() {
  const supabase = await createClient();

  // Obtener perfil del profesor
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
          ¡Hola, {profile?.name || "Profesor"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Acá tenés un resumen de tu actividad
        </p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Turnos de hoy</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Próximamente: ver turnos del día
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pendientes</CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-500">
              0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Turnos por confirmar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos del mes</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">
              $0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Módulo financiero próximamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alumnos activos</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gestión de alumnos próximamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de próximas funcionalidades */}
      <Card className="border-dashed border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg">🚧 Próximos pasos</CardTitle>
          <CardDescription>
            Funcionalidades que se irán habilitando a medida que avancemos:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📅 Módulo 2 — Completar perfil y configurar disponibilidad</li>
            <li>🎾 Módulo 3 — Sistema de turnos y reservas</li>
            <li>💰 Módulo 4 — Módulo financiero (cobros, paquetes, dashboard)</li>
            <li>👥 Módulo 5 — Gestión completa de alumnos</li>
            <li>📧 Módulo 6 — Notificaciones por email</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
