/**
 * Server Actions para autenticacion.
 * Estas funciones se ejecutan en el servidor y manejan registro, login y logout.
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateUniqueProfileSlug } from "@/lib/profile-slug";
import { createClient } from "@/lib/supabase/server";

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

  await new Promise((resolve) => setTimeout(resolve, 500));

  const generatedSlug = await generateUniqueProfileSlug(
    formData.name,
    async (slug) => {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", slug)
        .maybeSingle();

      return existingProfile;
    },
    data.user.id
  );

  const profileUpdate: {
    username: string;
    category?: string | null;
    branch?: string | null;
    zone?: string | null;
  } = {
    username: generatedSlug,
  };

  if (formData.role === "alumno") {
    profileUpdate.category = formData.category || null;
    profileUpdate.branch = formData.branch || null;
    profileUpdate.zone = formData.zone || null;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("user_id", data.user.id);

  if (updateError) {
    console.error("Error al actualizar el perfil despues del registro:", updateError);
  }

  revalidatePath("/", "layout");
  redirect(formData.role === "profesor" ? "/profesor" : "/alumno");
}

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

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
