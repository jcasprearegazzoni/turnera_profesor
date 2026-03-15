/**
 * Middleware de Next.js — Protección de rutas.
 * Ejecuta en cada request antes de renderizar la página.
 * 
 * Lógica:
 * 1. Refresca la sesión de Supabase
 * 2. Redirige usuarios no autenticados a /login
 * 3. Redirige usuarios autenticados fuera de /login y /registro
 * 4. Verifica que el rol del usuario coincida con la ruta
 */
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ["/profesor", "/alumno"];

// Rutas solo para usuarios NO autenticados
const AUTH_ROUTES = ["/login", "/registro"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // --- Caso 1: Ruta protegida sin sesión → redirigir a /login ---
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- Caso 2: Usuario autenticado intenta ir a login/registro → redirigir a su dashboard ---
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && user) {
    // Obtener el rol del usuario desde la tabla profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === "profesor" ? "/profesor" : "/alumno";
    return NextResponse.redirect(url);
  }

  // --- Caso 3: Verificar que el usuario acceda a rutas de su propio rol ---
  if (isProtectedRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    // Si no tiene perfil todavía, dejarlo pasar (recién se registró)
    if (!profile) {
      return supabaseResponse;
    }

    // Un alumno intenta acceder a /profesor → redirigir a /alumno
    if (pathname.startsWith("/profesor") && profile.role !== "profesor") {
      const url = request.nextUrl.clone();
      url.pathname = "/alumno";
      return NextResponse.redirect(url);
    }

    // Un profesor intenta acceder a /alumno → redirigir a /profesor
    if (pathname.startsWith("/alumno") && profile.role !== "alumno") {
      const url = request.nextUrl.clone();
      url.pathname = "/profesor";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// Definir en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Archivos con extensión (ej: .png, .jpg, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
