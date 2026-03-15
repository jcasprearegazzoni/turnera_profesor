/**
 * Server Actions para autenticación.
 * Estas funciones se ejecutan en el servidor y manejan registro, login y logout.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================================
// Registro de nuevo usuario
// ============================================================
export async function registrarUsuario(formData: {
  email: string;
  password: string;
  name: string;
  role: "profesor" | "alumno";
  category?: string;
  branch?: string;
  zone?: string;
}) {
  const supabase = await createClient();

  // Crear usuario en Supabase Auth con metadata
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        role: formData.role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "No se pudo crear el usuario" };
  }

  // Si es alumno, actualizar los campos adicionales en profiles
  if (formData.role === "alumno" && (formData.category || formData.branch || formData.zone)) {
    // Esperar un momento para que el trigger cree el perfil
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        category: formData.category || null,
        branch: formData.branch || null,
        zone: formData.zone || null,
      })
      .eq("user_id", data.user.id);

    if (updateError) {
      console.error("Error al actualizar perfil de alumno:", updateError);
    }
  }

  // Revalidar y redirigir al dashboard correspondiente
  revalidatePath("/", "layout");
  redirect(formData.role === "profesor" ? "/profesor" : "/alumno");
}

// ============================================================
// Inicio de sesión
// ============================================================
export async function iniciarSesion(formData: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Obtener el rol del usuario para redirigir al dashboard correcto
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No se pudo obtener el usuario" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  revalidatePath("/", "layout");
  redirect(profile?.role === "profesor" ? "/profesor" : "/alumno");
}

// ============================================================
// Cerrar sesión
// ============================================================
export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
