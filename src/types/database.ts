/**
 * Tipos de TypeScript para las tablas de la base de datos en Supabase.
 * Estos tipos reflejan el esquema SQL definido en supabase/migrations/.
 */

// Roles disponibles en la aplicación
export type UserRole = "profesor" | "alumno";

// Deportes disponibles
export type Sport = "tenis" | "padel" | "ambos";

// Tipos de clase
export type BookingType = "individual" | "grupal" | "dobles";

// Estados de un turno
export type BookingStatus =
  | "pendiente"
  | "confirmado"
  | "completado"
  | "cancelado";

// Métodos de pago
export type PaymentMethod = "efectivo" | "transferencia_directa";

// ============================================================
// Tabla: profiles
// ============================================================
export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  sport: Sport | null;
  price_individual: number | null;
  price_grupal: number | null;
  max_students_grupal: number;
  max_students_dual: number;
  cancellation_hours: number;
  // Campos de contacto
  phone: string | null;
  instagram_url: string | null;
  // Campos adicionales para alumnos
  category: string | null; // ej: "5ta", "6ta"
  branch: string | null; // "caballero" | "dama"
  zone: string | null; // ej: "zona sur"
  created_at: string;
}

// ============================================================
// Tabla: availability
// ============================================================
export interface Availability {
  id: string;
  profesor_id: string;
  day_of_week: number; // 0 = domingo, 6 = sábado
  start_time: string; // formato "HH:mm:ss"
  end_time: string;
  slot_duration_minutes: number;
}

// ============================================================
// Tabla: blocked_dates
// ============================================================
export interface BlockedDate {
  id: string;
  profesor_id: string;
  date: string; // formato "YYYY-MM-DD"
  reason: string | null;
}

// ============================================================
// Tabla: bookings
// ============================================================
export interface Booking {
  id: string;
  profesor_id: string;
  alumno_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: BookingType;
  comment: string | null;
  status: BookingStatus;
  created_at: string;
}

// ============================================================
// Tabla: packages
// ============================================================
export interface Package {
  id: string;
  profesor_id: string;
  name: string;
  total_classes: number;
  price: number;
  description: string | null;
  active: boolean;
}

// ============================================================
// Tabla: student_packages
// ============================================================
export interface StudentPackage {
  id: string;
  alumno_id: string;
  package_id: string;
  profesor_id: string;
  classes_remaining: number;
  paid: boolean;
  created_at: string;
}

// ============================================================
// Tabla: payments
// ============================================================
export interface Payment {
  id: string;
  alumno_id: string;
  profesor_id: string;
  amount: number;
  method: PaymentMethod;
  booking_id: string | null;
  package_id: string | null;
  note: string | null;
  created_at: string;
}

// ============================================================
// Tabla: notes
// ============================================================
export interface Note {
  id: string;
  profesor_id: string;
  alumno_id: string;
  content: string;
  created_at: string;
}
