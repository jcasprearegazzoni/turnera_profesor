/**
 * Página de Login — /login
 * Server Component que renderiza el formulario de login.
 */
import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return <LoginForm />;
}
