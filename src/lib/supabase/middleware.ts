/**
 * Helper de Supabase para el MIDDLEWARE de Next.js.
 * Refresca la sesión del usuario en cada request.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Actualiza la sesión de Supabase y devuelve la response con cookies actualizadas
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Setear cookies en el request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Crear nueva response con cookies actualizadas
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: No usar getSession() — getUser() es más seguro ya que
  // valida el token contra el servidor de Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user, supabase };
}
