import { z } from "zod";

export const blockedDateSchema = z
  .object({
    start_date: z.date({
      message: "Debes seleccionar una fecha de inicio",
    }),
    end_date: z.date({
      message: "Debes seleccionar una fecha de fin",
    }),
    reason: z.string().max(100, "El motivo es muy largo").optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
    path: ["end_date"],
  });

export type BlockedDateFormValues = z.infer<typeof blockedDateSchema>;
