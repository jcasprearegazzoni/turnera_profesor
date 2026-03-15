import { z } from "zod";

export const sportSchema = z.enum(["tenis", "padel", "ambos"]);

export const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  avatar_url: z.string().url("Debe ser una URL valida").optional().or(z.literal("")),
  bio: z.string().max(500, "La biografia no puede exceder los 500 caracteres").optional(),
  sport: sportSchema.optional().nullable(),
  price_per_class: z.number().min(0, "El precio no puede ser negativo").optional(),
  price_grupal: z.number().min(0, "El precio grupal no puede ser negativo").optional(),
  phone: z.string().optional(),
  instagram_url: z.string().url("Debe ser una URL valida").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
