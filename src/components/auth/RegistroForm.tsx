/**
 * Componente del formulario de REGISTRO.
 * Incluye selección de rol y campos condicionales para alumnos.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registroSchema,
  type RegistroFormValues,
  ZONAS,
  CATEGORIAS,
  RAMAS,
} from "@/lib/validations/auth";
import { registrarUsuario } from "@/app/(auth)/actions";
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

export default function RegistroForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Configurar React Hook Form con validación de Zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      category: "",
      branch: "",
      zone: "",
    },
  });

  // Observar el rol seleccionado para mostrar/ocultar campos de alumno
  const selectedRole = watch("role");

  // Manejar el envío del formulario
  async function onSubmit(data: RegistroFormValues) {
    setIsLoading(true);
    try {
      const result = await registrarUsuario({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        category: data.category,
        branch: data.branch,
        zone: data.zone,
      });
      if (result?.error) {
        toast.error("Error al registrarse", {
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
          Crear cuenta
        </CardTitle>
        <CardDescription className="text-center">
          Completá tus datos para empezar
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Campo: Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Juan Pérez"
              autoComplete="name"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Campo: Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Selección de rol */}
          <div className="space-y-3">
            <Label>¿Qué sos?</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opción: Profesor */}
              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === "profesor"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="profesor"
                  className="sr-only"
                  {...register("role")}
                />
                <span className="text-2xl">🎓</span>
                <span className="font-medium text-sm">Profesor</span>
              </label>

              {/* Opción: Alumno */}
              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === "alumno"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="alumno"
                  className="sr-only"
                  {...register("role")}
                />
                <span className="text-2xl">🎾</span>
                <span className="font-medium text-sm">Alumno</span>
              </label>
            </div>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Campos adicionales para ALUMNOS */}
          {selectedRole === "alumno" && (
            <div className="space-y-4 pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Datos adicionales de alumno (opcionales)
              </p>

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isLoading}
                  {...register("category")}
                >
                  <option value="">Seleccioná tu categoría</option>
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rama */}
              <div className="space-y-2">
                <Label htmlFor="branch">Rama</Label>
                <select
                  id="branch"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isLoading}
                  {...register("branch")}
                >
                  <option value="">Seleccioná tu rama</option>
                  {RAMAS.map((rama) => (
                    <option key={rama} value={rama}>
                      {rama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zona */}
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <select
                  id="zone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isLoading}
                  {...register("zone")}
                >
                  <option value="">Seleccioná tu zona</option>
                  {ZONAS.map((zona) => (
                    <option key={zona} value={zona}>
                      {zona}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Botón de submit */}
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          {/* Link a login */}
          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
