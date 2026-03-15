"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  blockedDateSchema,
  type BlockedDateFormValues,
} from "@/lib/validations/blocked-dates";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateRange(startDate: Date, endDate: Date) {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(formatLocalDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export async function bloquearFecha(data: BlockedDateFormValues) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "No autorizado" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return { success: false, error: "Perfil no encontrado" };
    }

    const validatedData = blockedDateSchema.parse(data);
    const datesToBlock = getDateRange(validatedData.start_date, validatedData.end_date);

    const { data: existingDates } = await supabase
      .from("blocked_dates")
      .select("date")
      .eq("profesor_id", profile.id)
      .gte("date", datesToBlock[0])
      .lte("date", datesToBlock[datesToBlock.length - 1]);

    const blockedDateSet = new Set((existingDates || []).map((item) => item.date));
    const newDates = datesToBlock.filter((date) => !blockedDateSet.has(date));

    if (newDates.length === 0) {
      return { success: false, error: "Todas las fechas del rango ya estaban bloqueadas" };
    }

    const rowsToInsert = newDates.map((date) => ({
      profesor_id: profile.id,
      date,
      reason: validatedData.reason || null,
    }));

    const { error: insertError } = await supabase.from("blocked_dates").insert(rowsToInsert);

    if (insertError) {
      console.error("Error al bloquear fechas:", insertError);
      return { success: false, error: "Error al guardar en la base de datos" };
    }

    revalidatePath("/profesor/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error en bloquearFecha:", error);
    return { success: false, error: "Error de validacion o del servidor" };
  }
}

export async function desbloquearFecha(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "No autorizado" };
    }

    const { error: deleteError } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al desbloquear fecha:", deleteError);
      return { success: false, error: "Error al borrar en la base de datos" };
    }

    revalidatePath("/profesor/perfil");
    return { success: true };
  } catch {
    return { success: false, error: "Error de servidor" };
  }
}
