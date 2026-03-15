"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  bloquearFecha,
  desbloquearFecha,
} from "@/app/(dashboard)/profesor/acciones-bloqueos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { blockedDateSchema, type BlockedDateFormValues } from "@/lib/validations/blocked-dates";
import type { BlockedDate } from "@/types/database";

interface BlockedDatesFormProps {
  blockedDates: BlockedDate[];
}

function DatePickerField({
  value,
  onChange,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          />
        }
      >
        {value ? format(value, "PPP", { locale: es }) : <span>{placeholder}</span>}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function BlockedDatesForm({ blockedDates }: BlockedDatesFormProps) {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const form = useForm<BlockedDateFormValues>({
    resolver: zodResolver(blockedDateSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(data: BlockedDateFormValues) {
    setIsSubmiting(true);
    try {
      const response = await bloquearFecha(data);

      if (response.success) {
        toast.success("Rango bloqueado correctamente");
        form.reset();
      } else {
        toast.error(response.error || "Ocurrio un error al bloquear las fechas");
      }
    } catch {
      toast.error("Error de conexion");
    } finally {
      setIsSubmiting(false);
    }
  }

  async function handleUnblock(id: string) {
    try {
      const response = await desbloquearFecha(id);

      if (response.success) {
        toast.success("Fecha desbloqueada");
      } else {
        toast.error(response.error || "Error al desbloquear la fecha");
      }
    } catch {
      toast.error("Error de conexion");
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormControl>
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Desde"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormControl>
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Hasta"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormControl>
                    <Input placeholder="Motivo (ej. Vacaciones, Torneo)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmiting} className="w-full sm:w-auto">
              {isSubmiting ? "..." : "Bloquear rango"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 space-y-3">
        {blockedDates.length === 0 ? (
          <p className="rounded-lg border border-dashed py-4 text-center text-sm text-muted-foreground">
            No tenes fechas bloqueadas
          </p>
        ) : (
          blockedDates.map((blocked) => {
            const dateObj = new Date(`${blocked.date}T12:00:00`);
            const formattedDate = format(dateObj, "EEEE d 'de' MMMM, yyyy", {
              locale: es,
            });

            return (
              <div
                key={blocked.id}
                className="flex flex-col items-start justify-between gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="font-medium capitalize">{formattedDate}</div>
                  {blocked.reason && (
                    <Badge variant="secondary" className="mt-1 font-normal">
                      {blocked.reason}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnblock(blocked.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Desbloquear
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
