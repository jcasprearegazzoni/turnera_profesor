-- ==============================================================
-- CourtManager — Migración 002: Agregar campos al Profile
-- Ejecutar este SQL en el SQL Editor de Supabase
-- ==============================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS instagram_url text;
