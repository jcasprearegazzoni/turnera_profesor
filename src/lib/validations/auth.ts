/**
 * Esquemas de validación con Zod para los formularios de autenticación.
 * Cada esquema define las reglas de validación y los mensajes de error en español.
 */
import { z } from "zod";

// Lista de zonas disponibles en Argentina
export const ZONAS = [
  "Zona Norte",
  "Zona Sur",
  "Zona Oeste",
  "Zona Este",
  "CABA",
  "La Plata",
  "Mar del Plata",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "Otra",
] as const;

// Categorías de tenis
export const CATEGORIAS = [
  "1ra",
  "2da",
  "3ra",
  "4ta",
  "5ta",
  "6ta",
  "7ma",
  "8va",
  "Principiante",
  "Intermedio",
  "Avanzado",
] as const;

// Ramas
export const RAMAS = ["Caballero", "Dama"] as const;

// ============================================================
// Esquema de REGISTRO
// ============================================================
export const registroSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede superar 100 caracteres"),
    email: z
      .string()
      .email("Ingresá un email válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    role: z.enum(["profesor", "alumno"], {
      message: "Elegí un rol",
    }),
    // Campos opcionales para alumnos
    category: z.string().optional(),
    branch: z.string().optional(),
    zone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Tipo inferido del esquema de registro
export type RegistroFormValues = z.infer<typeof registroSchema>;

// ============================================================
// Esquema de LOGIN
// ============================================================
export const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

// Tipo inferido del esquema de login
export type LoginFormValues = z.infer<typeof loginSchema>;
