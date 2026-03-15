/**
 * Layout del Dashboard — Envuelve las páginas de profesor y alumno.
 * Server Component: obtiene la sesión y perfil del usuario.
 * Redirige a /login si no hay sesión.
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verificar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar profile={profile as Profile} />
      <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
