/**
 * Callback de autenticación de Supabase.
 * Maneja la confirmación de email y el intercambio de código OAuth.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Obtener el rol del usuario para redirigir correctamente
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const redirectTo =
          profile?.role === "profesor" ? "/profesor" : "/alumno";
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si hay error, redirigir a login con mensaje de error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
