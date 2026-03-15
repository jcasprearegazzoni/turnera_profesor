"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { guardarHorarios } from "@/app/(dashboard)/profesor/acciones-horarios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import {
  availabilityFormSchema,
  type AvailabilityFormValues,
} from "@/lib/validations/availability";
import type { Availability } from "@/types/database";

interface AvailabilityFormProps {
  initialAvailabilities: Availability[];
}

const daysOfWeek = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
  { value: 0, label: "Domingo" },
];

function sortAvailabilities(values: Availability[]) {
  return [...values].sort((first, second) => {
    const firstIndex = daysOfWeek.findIndex((day) => day.value === first.day_of_week);
    const secondIndex = daysOfWeek.findIndex((day) => day.value === second.day_of_week);

    return firstIndex - secondIndex;
  });
}

function normalizeMinutesInput(value: string) {
  const onlyDigits = value.replace(/\D/g, "");

  if (!onlyDigits) {
    return undefined;
  }

  return Number(onlyDigits);
}

export default function AvailabilityForm({
  initialAvailabilities,
}: AvailabilityFormProps) {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const defaultValues: AvailabilityFormValues = {
    slots: sortAvailabilities(initialAvailabilities).map((availability) => ({
      id: availability.id,
      day_of_week: availability.day_of_week,
      start_time: availability.start_time.substring(0, 5),
      end_time: availability.end_time.substring(0, 5),
      slot_duration_minutes: availability.slot_duration_minutes,
    })),
  };

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues:
      defaultValues.slots.length > 0
        ? defaultValues
        : {
            slots: [
              {
                day_of_week: 1,
                start_time: "08:00",
                end_time: "18:00",
                slot_duration_minutes: 60,
              },
            ],
          },
  });

  const { fields, append, remove } = useFieldArray({
    name: "slots",
    control: form.control,
  });

  async function onSubmit(data: AvailabilityFormValues) {
    setIsSubmiting(true);
    try {
      const response = await guardarHorarios(data);

      if (response.success) {
        toast.success("Horarios guardados correctamente");
      } else {
        toast.error(response.error || "Ocurrio un error al guardar los horarios");
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
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardContent className="pt-6 pb-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  X
                </Button>

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`slots.${index}.day_of_week`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => {
                            if (value === null) {
                              return;
                            }

                            field.onChange(Number(value));
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Dia">
                                {(value) =>
                                  daysOfWeek.find((day) => day.value.toString() === value)
                                    ?.label || "Dia"
                                }
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value.toString()}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`slots.${index}.start_time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inicio (HH:mm)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`slots.${index}.end_time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fin (HH:mm)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`slots.${index}.slot_duration_minutes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turno (minutos)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={field.value === undefined ? "" : String(field.value)}
                            onChange={(event) =>
                              field.onChange(normalizeMinutesInput(event.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            No tenes horarios cargados. Agrega uno para que tus alumnos puedan reservar.
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                day_of_week: 1,
                start_time: "08:00",
                end_time: "18:00",
                slot_duration_minutes: 60,
              })
            }
          >
            + Agregar horario
          </Button>

          <Button type="submit" disabled={isSubmiting}>
            {isSubmiting ? "Guardando..." : "Guardar horarios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
