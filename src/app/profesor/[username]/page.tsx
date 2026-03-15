import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const daysOfWeek = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
  { value: 0, label: "Domingo" },
];

interface PublicProfileProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfesorPage({ params }: PublicProfileProps) {
  const resolvedParams = await params;
  const decodedUsername = decodeURIComponent(resolvedParams.username);

  const supabase = await createClient();

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "profesor")
    .eq("username", decodedUsername)
    .maybeSingle();

  if (!profile) {
    const { data: profileById } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "profesor")
      .eq("id", decodedUsername)
      .maybeSingle();

    profile = profileById;
  }

  if (!profile) {
    notFound();
  }

  const { data: availabilities } = await supabase
    .from("availability")
    .select("*")
    .eq("profesor_id", profile.id);

  const sortedAvailabilities = [...(availabilities || [])].sort((first, second) => {
    const firstIndex = daysOfWeek.findIndex((day) => day.value === first.day_of_week);
    const secondIndex = daysOfWeek.findIndex((day) => day.value === second.day_of_week);

    return firstIndex - secondIndex;
  });

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-background p-8 text-center shadow-sm md:flex-row md:text-left">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`Foto de perfil de ${profile.name}`}
              className="h-24 w-24 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{profile.name}</h1>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {profile.sport && (
                <Badge variant="secondary" className="px-3 py-1 text-sm capitalize">
                  Profesor de {profile.sport}
                </Badge>
              )}
              {profile.price_individual && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                >
                  {currencyFormatter.format(profile.price_individual)} por clase
                </Badge>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 max-w-xl text-muted-foreground md:mx-0">{profile.bio}</p>
            )}

            {(profile.phone || profile.instagram_url) && (
              <div className="flex justify-center gap-4 pt-4 md:justify-start">
                {profile.phone && (
                  <span className="rounded-md border px-3 py-1.5 text-sm font-medium">
                    {profile.phone}
                  </span>
                )}
                {profile.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad</CardTitle>
            <CardDescription>Horarios habituales del profesor</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedAvailabilities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {sortedAvailabilities.map((slot) => (
                  <div key={slot.id} className="rounded-lg border bg-card p-4">
                    <div className="font-semibold text-primary">
                      {daysOfWeek.find((day) => day.value === slot.day_of_week)?.label}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {slot.start_time.substring(0, 5)} hrs - {slot.end_time.substring(0, 5)} hrs
                    </div>
                    <div className="mt-2 w-fit rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Turnos de {slot.slot_duration_minutes} min
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                El profesor aun no cargo sus horarios.
              </div>
            )}

            <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <h4 className="mb-2 font-semibold text-primary">Queres reservar una clase?</h4>
              <p className="mb-4 text-sm text-foreground/80">
                Inicia sesion como alumno para ver el calendario en vivo y reservar tu horario.
              </p>
              <Badge className="px-4 py-2 text-sm">Reserva de turnos proximamente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
