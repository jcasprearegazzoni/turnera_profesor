"use server";

import { createClient } from "@/lib/supabase/server";
import { availabilityFormSchema, type AvailabilityFormValues } from "@/lib/validations/availability";
import { revalidatePath } from "next/cache";

export async function guardarHorarios(data: AvailabilityFormValues) {
  try {
    const supabase = await createClient();
    
    // Check session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "No autorizado" };
    }

    // Get professor id from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return { success: false, error: "Perfil de profesor no encontrado" };
    }

    // Validate data
    const validatedData = availabilityFormSchema.parse(data);

    // Delete existing availability slots for this professor
    const { error: deleteError } = await supabase
      .from("availability")
      .delete()
      .eq("profesor_id", profile.id);

    if (deleteError) {
      console.error("Error al borrar horarios existentes:", deleteError);
      return { success: false, error: "Error al actualizar la base de datos" };
    }

    // Insert new availability slots if any exist
    if (validatedData.slots.length > 0) {
      const dbSlots = validatedData.slots.map(slot => ({
        profesor_id: profile.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        slot_duration_minutes: slot.slot_duration_minutes
      }));

      const { error: insertError } = await supabase
        .from("availability")
        .insert(dbSlots);

      if (insertError) {
        console.error("Error al insertar nuevos horarios:", insertError);
        return { success: false, error: "Error al guardar los nuevos horarios" };
      }
    }

    revalidatePath("/profesor/perfil");
    return { success: true };
    
  } catch (error) {
    console.error("Error en guardarHorarios:", error);
    return { success: false, error: "Error de validación o del servidor" };
  }
}
