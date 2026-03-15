-- ==============================================================
-- CourtManager — Migración 001: Tabla profiles + trigger
-- Ejecutar este SQL en el SQL Editor de Supabase
-- ==============================================================

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================
-- Tabla: profiles
-- Almacena la información del perfil de cada usuario (profesor o alumno)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('profesor', 'alumno')),
  name text NOT NULL DEFAULT '',
  username text UNIQUE,
  avatar_url text,
  bio text,
  sport text CHECK (sport IN ('tenis', 'padel', 'ambos')),
  price_individual numeric,
  price_grupal numeric,
  max_students_grupal integer DEFAULT 6,
  max_students_dual integer DEFAULT 2,
  cancellation_hours integer DEFAULT 2,
  -- Campos adicionales para alumnos
  category text,       -- ej: "5ta", "6ta"
  branch text,         -- "caballero" | "dama"
  zone text,           -- ej: "zona sur"
  created_at timestamptz DEFAULT now()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ==============================================================
-- Tabla: availability
-- Horarios semanales disponibles de cada profesor
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.availability (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer DEFAULT 60,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_profesor ON public.availability(profesor_id);

-- ==============================================================
-- Tabla: blocked_dates
-- Fechas bloqueadas por el profesor (feriados, vacaciones, etc.)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  reason text
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_profesor ON public.blocked_dates(profesor_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON public.blocked_dates(date);

-- ==============================================================
-- Tabla: bookings
-- Reservas de turnos entre alumnos y profesores
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alumno_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  type text NOT NULL CHECK (type IN ('individual', 'grupal', 'dobles')),
  comment text,
  status text NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'completado', 'cancelado')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_profesor ON public.bookings(profesor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_alumno ON public.bookings(alumno_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ==============================================================
-- Tabla: packages
-- Paquetes de clases que crea el profesor
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  total_classes integer NOT NULL,
  price numeric NOT NULL,
  description text,
  active boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_packages_profesor ON public.packages(profesor_id);

-- ==============================================================
-- Tabla: student_packages
-- Paquetes comprados por alumnos (con créditos restantes)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.student_packages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  alumno_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  classes_remaining integer NOT NULL,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_packages_alumno ON public.student_packages(alumno_id);
CREATE INDEX IF NOT EXISTS idx_student_packages_profesor ON public.student_packages(profesor_id);

-- ==============================================================
-- Tabla: payments
-- Registro de cobros y pagos
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  alumno_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  method text NOT NULL CHECK (method IN ('efectivo', 'transferencia_directa')),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_alumno ON public.payments(alumno_id);
CREATE INDEX IF NOT EXISTS idx_payments_profesor ON public.payments(profesor_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON public.payments(created_at);

-- ==============================================================
-- Tabla: notes
-- Notas privadas del profesor sobre cada alumno
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profesor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alumno_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_profesor ON public.notes(profesor_id);
CREATE INDEX IF NOT EXISTS idx_notes_alumno ON public.notes(alumno_id);

-- ==============================================================
-- Trigger: Crear perfil automáticamente al registrar un usuario
-- ==============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'alumno'),
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger existente si lo hay
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger que ejecuta la función al crear un usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================
-- Row Level Security (RLS) — Políticas de seguridad
-- ==============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- ---- Políticas para PROFILES ----

-- Cualquiera puede ver perfiles de profesores (son públicos)
CREATE POLICY "Perfiles de profesores son públicos"
  ON public.profiles FOR SELECT
  USING (role = 'profesor');

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ---- Políticas para AVAILABILITY ----

-- Todos pueden ver la disponibilidad (para reservar)
CREATE POLICY "Disponibilidad es pública"
  ON public.availability FOR SELECT
  USING (true);

-- Solo el profesor dueño puede modificar su disponibilidad
CREATE POLICY "Profesor gestiona su disponibilidad"
  ON public.availability FOR ALL
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- Políticas para BLOCKED_DATES ----

-- Todos pueden ver las fechas bloqueadas (para el calendario)
CREATE POLICY "Fechas bloqueadas son públicas"
  ON public.blocked_dates FOR SELECT
  USING (true);

-- Solo el profesor puede gestionar sus fechas bloqueadas
CREATE POLICY "Profesor gestiona sus fechas bloqueadas"
  ON public.blocked_dates FOR ALL
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- Políticas para BOOKINGS ----

-- Profesor y alumno pueden ver sus propias reservas
CREATE POLICY "Ver propias reservas"
  ON public.bookings FOR SELECT
  USING (
    profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    alumno_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Los alumnos pueden crear reservas
CREATE POLICY "Alumnos crean reservas"
  ON public.bookings FOR INSERT
  WITH CHECK (
    alumno_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Profesor puede actualizar estado de sus reservas
CREATE POLICY "Profesor actualiza reservas"
  ON public.bookings FOR UPDATE
  USING (
    profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    alumno_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- ---- Políticas para PACKAGES ----

-- Todos pueden ver paquetes activos
CREATE POLICY "Paquetes activos son públicos"
  ON public.packages FOR SELECT
  USING (active = true);

-- Solo el profesor puede gestionar sus paquetes
CREATE POLICY "Profesor gestiona sus paquetes"
  ON public.packages FOR ALL
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- Políticas para STUDENT_PACKAGES ----

-- Alumno y profesor pueden ver los paquetes del alumno
CREATE POLICY "Ver paquetes del alumno"
  ON public.student_packages FOR SELECT
  USING (
    profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    alumno_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Profesor puede gestionar paquetes de sus alumnos
CREATE POLICY "Profesor gestiona paquetes de alumnos"
  ON public.student_packages FOR ALL
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- Políticas para PAYMENTS ----

-- Profesor y alumno pueden ver sus pagos
CREATE POLICY "Ver propios pagos"
  ON public.payments FOR SELECT
  USING (
    profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    alumno_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Profesor puede registrar cobros
CREATE POLICY "Profesor registra cobros"
  ON public.payments FOR INSERT
  WITH CHECK (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- Políticas para NOTES ----

-- Solo el profesor puede ver sus notas
CREATE POLICY "Profesor ve sus notas"
  ON public.notes FOR SELECT
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Solo el profesor puede gestionar sus notas
CREATE POLICY "Profesor gestiona sus notas"
  ON public.notes FOR ALL
  USING (profesor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
