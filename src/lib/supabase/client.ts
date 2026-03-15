/**
 * Cliente de Supabase para el NAVEGADOR (Client Components).
 * Se usa en componentes con "use client" que necesitan acceder a Supabase.
 */
import { createBrowserClient } from "@supabase/ssr";

// Función que crea el cliente de Supabase para el browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
