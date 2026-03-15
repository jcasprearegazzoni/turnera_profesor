import { z } from "zod";

export const availabilitySlotSchema = z
  .object({
    id: z.string().optional(),
    day_of_week: z.number().min(0).max(6),
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato invalido (HH:mm)"),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato invalido (HH:mm)"),
    slot_duration_minutes: z.number().min(15).max(180),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["end_time"],
  });

export const availabilityFormSchema = z.object({
  slots: z.array(availabilitySlotSchema),
});

export type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;
export type AvailabilitySlotFormValues = z.infer<typeof availabilitySlotSchema>;
