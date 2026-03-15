"use server";

import { revalidatePath } from "next/cache";

import { generateUniqueProfileSlug } from "@/lib/profile-slug";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profesor";
import type { Profile } from "@/types/database";

type ProfileUpdateData = Partial<
  Pick<
    Profile,
    | "avatar_url"
    | "bio"
    | "instagram_url"
    | "name"
    | "phone"
    | "price_grupal"
    | "price_individual"
    | "sport"
    | "username"
  >
>;

export async function actualizarPerfil(data: ProfileFormValues) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "No autorizado" };
    }

    const validatedData = profileSchema.parse(data);
    const generatedSlug = await generateUniqueProfileSlug(
      validatedData.name,
      async (slug) => {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("username", slug)
          .maybeSingle();

        return existingProfile;
      },
      user.id
    );

    const updateData: ProfileUpdateData = {
      name: validatedData.name.trim(),
      username: generatedSlug,
      avatar_url: validatedData.avatar_url?.trim() || null,
      bio: validatedData.bio?.trim() || null,
      sport: validatedData.sport ?? null,
      price_individual: validatedData.price_per_class ?? null,
      price_grupal: validatedData.price_grupal ?? null,
      phone: validatedData.phone?.trim() || null,
      instagram_url: validatedData.instagram_url?.trim() || null,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error al actualizar perfil:", updateError);
      return {
        success: false,
        error: "Error al actualizar el perfil en la base de datos",
      };
    }

    revalidatePath("/profesor/perfil");
    revalidatePath(`/profesor/${generatedSlug}`);

    return { success: true };
  } catch (error) {
    console.error("Error inesperado en actualizarPerfil:", error);
    return { success: false, error: "Error de validacion o servidor" };
  }
}
