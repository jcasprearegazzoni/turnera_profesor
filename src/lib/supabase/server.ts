/**
 * Cliente de Supabase para el SERVIDOR (Server Components, Route Handlers, Server Actions).
 * Usa cookies de Next.js para manejar la sesión del usuario.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Función asíncrona que crea el cliente de Supabase para el server
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // El método `setAll` fue llamado desde un Server Component.
            // Esto se puede ignorar si tenemos middleware que refresca las sesiones.
          }
        },
      },
    }
  );
}
