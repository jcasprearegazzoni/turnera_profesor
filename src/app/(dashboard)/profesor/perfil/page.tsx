import { redirect } from "next/navigation";

import AvailabilityForm from "@/components/profesor/AvailabilityForm";
import BlockedDatesForm from "@/components/profesor/BlockedDatesForm";
import ProfileForm from "@/components/profesor/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Mi Perfil | misu",
};

export default async function PerfilProfesorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "profesor") {
    redirect("/");
  }

  const { data: availabilities } = await supabase
    .from("availability")
    .select("*")
    .eq("profesor_id", profile.id)
    .order("day_of_week", { ascending: true });

  const { data: blockedDates } = await supabase
    .from("blocked_dates")
    .select("*")
    .eq("profesor_id", profile.id)
    .order("date", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu informacion publica y como te ven los alumnos.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="perfil">Datos personales</TabsTrigger>
          <TabsTrigger value="horarios">Mis horarios</TabsTrigger>
          <TabsTrigger value="bloqueos">Fechas bloqueadas</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos personales</CardTitle>
              <CardDescription>
                Actualiza tu informacion de contacto, disciplina y tarifas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad semanal</CardTitle>
              <CardDescription>
                Define en que dias y horarios das clases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityForm initialAvailabilities={availabilities || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bloqueos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fechas bloqueadas</CardTitle>
              <CardDescription>
                Bloquea rangos de fechas para feriados, vacaciones, torneos o lesiones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockedDatesForm blockedDates={blockedDates || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
