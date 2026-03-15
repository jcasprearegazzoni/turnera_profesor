/**
 * Página de Registro — /registro
 * Server Component que renderiza el formulario de registro.
 */
import RegistroForm from "@/components/auth/RegistroForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegistroPage() {
  return <RegistroForm />;
}
