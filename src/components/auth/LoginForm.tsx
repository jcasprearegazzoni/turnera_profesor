/**
 * Componente del formulario de LOGIN.
 * Client Component porque usa hooks (useForm, useState).
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { iniciarSesion } from "@/app/(auth)/actions";
import Link from "next/link";
import { toast } from "sonner";

// Componentes de shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Configurar React Hook Form con validación de Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Manejar el envío del formulario
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await iniciarSesion(data);
      if (result?.error) {
        toast.error("Error al iniciar sesión", {
          description: result.error,
        });
      }
    } catch {
      // La redirección de Next.js lanza un error técnico — es esperado
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-center">
          Ingresá tu email y contraseña para acceder
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Campo: Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Botón de submit */}
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>

          {/* Link a registro */}
          <p className="text-sm text-muted-foreground text-center">
            ¿No tenés cuenta?{" "}
            <Link
              href="/registro"
              className="text-primary font-medium hover:underline"
            >
              Registrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
