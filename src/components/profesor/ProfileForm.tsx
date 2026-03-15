"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { actualizarPerfil } from "@/app/(dashboard)/profesor/acciones";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profesor";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
}

const sportOptions = [
  { value: "tenis", label: "Tenis" },
  { value: "padel", label: "Padel" },
  { value: "ambos", label: "Ambos" },
] as const;

function normalizePriceInput(value: string) {
  const onlyDigits = value.replace(/\D/g, "");

  if (!onlyDigits) {
    return undefined;
  }

  return Number(onlyDigits);
}

function priceToInputValue(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      avatar_url: profile.avatar_url || "",
      bio: profile.bio || "",
      sport: profile.sport ?? null,
      price_per_class: profile.price_individual ?? undefined,
      price_grupal: profile.price_grupal ?? undefined,
      phone: profile.phone || "",
      instagram_url: profile.instagram_url || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmiting(true);
    try {
      const response = await actualizarPerfil(data);

      if (response.success) {
        toast.success("Perfil actualizado correctamente");
      } else {
        toast.error(response.error || "Ocurrio un error al actualizar el perfil");
      }
    } catch {
      toast.error("Ocurrio un error inesperado al comunicarse con el servidor");
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Juan Perez" {...field} />
              </FormControl>
              <FormDescription>
                Este mismo nombre tambien se usa para generar la URL publica del perfil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto de perfil (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                En este MVP la foto se carga pegando el link de una imagen.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia / descripcion</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conta un poco sobre tu experiencia y tu estilo para dar clases..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deporte principal</FormLabel>
              <Select
                value={field.value ?? null}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un deporte">
                      {(value) =>
                        sportOptions.find((sport) => sport.value === value)?.label ||
                        "Selecciona un deporte"
                      }
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sportOptions.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price_per_class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio individual</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="10000"
                      className="pl-7"
                      value={priceToInputValue(field.value)}
                      onChange={(event) =>
                        field.onChange(normalizePriceInput(event.target.value))
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Podes escribir `10000` o `10.000`. Lo guardamos normalizado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_grupal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio grupal</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="10000"
                      className="pl-7"
                      value={priceToInputValue(field.value)}
                      onChange={(event) =>
                        field.onChange(normalizePriceInput(event.target.value))
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Podes escribir `10000` o `10.000`. Lo guardamos normalizado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono de contacto</FormLabel>
              <FormControl>
                <Input placeholder="Ej. +54 9 11 1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://instagram.com/tu_usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmiting} className="w-full sm:w-auto">
          {isSubmiting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}
