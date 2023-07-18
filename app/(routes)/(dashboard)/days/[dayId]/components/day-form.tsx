"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/alert-modal";

import { Day } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { addMonths, format, formatISO, isValid, parseISO } from "date-fns";
import es from "date-fns/locale/es";

const formSchema = z.object({
  weekday: z.string().refine(
    (value) => {
      const date = parseISO(value);
      return !isNaN(date.getTime());
    },
    { message: "A valid date is required." },
  ),
});

type DayFormValues = z.infer<typeof formSchema>;

interface DayFormProps {
  initialData: Day | null;
}

export const DayForm: React.FC<DayFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createDay = trpc.createDay.useMutation();
  const deleteDay = trpc.deleteDayInternal.useMutation();

  const title = initialData ? "Editar dia" : "Crear dia";
  const description = initialData ? "Editar un dia." : "Añãadir un dia.";
  const toastMessage = initialData ? "Dia actualizado." : "Dia creado.";
  const action = initialData ? "Guardar Cambios" : "Crear";

  const form = useForm<DayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekday:
        initialData?.weekday && isValid(parseISO(initialData.weekday))
          ? formatISO(parseISO(initialData.weekday))
          : formatISO(new Date()),
    },
  });

  const onSubmit = async (data: DayFormValues) => {
    setLoading(true);

    const weekdayName = format(new Date(data.weekday), "EEEE", { locale: es });

    createDay.mutate(
      {
        weekday: weekdayName,
      },
      {
        onSuccess(data, variables, context) {
          toast({
            title: toastMessage,
            description: "Day updated.",
          });
        },
        onError(error, variables, context) {
          toast({
            title: "Something went wrong.",
            description: error.message,
          });
        },
      },
    );

    setLoading(false);
    router.push(`/days`);
    setTimeout(() => {
      router.refresh();
    }, 600);
  };

  const onDelete = async () => {
    if (!initialData || !initialData.id)
      return toast({
        title: "Something went wrong.",
      });

    setLoading(true);
    deleteDay.mutate(
      {
        dayId: initialData?.id,
      },
      {
        onSuccess(data, variables, context) {
          toast({
            title: "Day deleted.",
            description: "Day updated.",
            duration: 3000,
          });
          router.push(`/days`);
          setTimeout(() => {
            router.refresh();
          }, 600);
        },
        onError(error, variables, context) {
          toast({
            title: "Something went wrong.",
            description: error.message,
            duration: 3000,
          });
          router.push(`/days`);
          setTimeout(() => {
            router.refresh();
          }, 600);
        },
      },
    );

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="weekday"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Dias de la semana</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "EEEE", { locale: es })
                        ) : (
                          <span>Día</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        const selectedDate: string = date
                          ? date.toISOString()
                          : "";
                        field.onChange(selectedDate);
                      }}
                      disabled={(date) =>
                        date < new Date() || date > addMonths(new Date(), 1)
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Seleccione un dia para trabajar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
