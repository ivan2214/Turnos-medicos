/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Time, Day, Appointment, Patient } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  patientId: z.string().uuid().min(1),
  dayId: z.string().uuid().min(1),
  busy: z.boolean().default(true).optional(),
  time: z.object({
    timeId: z.string().uuid().min(1).optional(),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  }),
});

interface InitialDate {
  id: string;
  busy: boolean;
  createdAt: Date;
  patient: Patient | null;
  patientId: string | null;
  day: Day | null;
  dayId: string | null;
  time: Time | null;
  timeId: string | null;
}

interface AppointmentFormProps {
  initialData: InitialDate | null;
  patients: Patient[];
  days: Day[];
  times: Time[];
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  days,
  patients,
  times,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterTime, setFilterTime] = useState<Time[]>([
    {
      startTime: "",
      endTime: "",
      createdAt: new Date(),
      dayId: "",
      id: "",
    },
  ]);

  const createAppointmentForm = trpc.createAppointmentInternal.useMutation();
  const deleteAppointmentForm = trpc.deleteAppointmentInteral.useMutation();

  const title = initialData ? "Editar turno" : "Crear turno";
  const description = initialData ? "Editar este turno." : "Añadir nuevo turno";
  const toastMessage = initialData ? "Turno actualizado." : "Turno creado.";
  const action = initialData ? "Guardar cambios" : "Crear nuevo turno";

  const defaultValues = initialData
    ? {
        ...initialData,
        dayId: initialData.dayId ?? "",
        patientId: initialData.patientId ?? "",
        time: {
          timeId: initialData.time?.id,
          startTime: initialData.time?.startTime,
          endTime: initialData.time?.endTime,
        },
      }
    : {
        busy: false,
        patientId: "",
        dayId: "",
        time: {
          timeId: "",
          startTime: "",
          endTime: "",
        },
      };

  let form;

  if (initialData) {
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues,
    });
  } else {
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
  }

  useEffect(() => {
    if (initialData) {
      setFilterTime([
        {
          createdAt: initialData.createdAt,
          dayId: initialData.dayId,
          endTime: initialData.time?.endTime || "",
          startTime: initialData.time?.startTime || "",
          id: initialData.time?.id || "",
        },
      ]);
    }
  }, [initialData]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    const timeEquals = times.find(
      (time) =>
        time.startTime === data.time.startTime &&
        time.endTime === data.time.endTime,
    );

    if (timeEquals) {
      createAppointmentForm.mutate(
        {
          dayId: data.dayId,
          patientId: data.patientId,
          busy: data.busy,
          time: {
            timeId: timeEquals.id,
            startTime: data.time.startTime,
            endTime: data.time.endTime,
          },
          appointmentId: initialData?.id && initialData.id,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "Turno creado.",
              description: toastMessage,
              duration: 3000,
            });
            router.push(`/appointments`);
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
            router.push(`/appointments`);
            setTimeout(() => {
              router.refresh();
            }, 600);
          },
        },
      );
    }
  }

  const onDelete = async () => {
    if (!initialData)
      return toast({
        title: "Ups algo salio mal",
        description: "Es necesario seleccionar un turno para eliminarlo",
      });

    try {
      setLoading(true);
      deleteAppointmentForm.mutate(
        {
          appointmentId: initialData?.id!,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "Su turno se elimino.",
              description: "Turno Eliminado con exito.",
            });
          },
          onError(error, variables, context) {
            toast({
              title: "Algo salió mal.",
              description: error.message,
            });
          },
        },
      );
      router.push(`/appointments`);
      setTimeout(() => {
        router.refresh();
      }, 600);
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="grid w-full grid-cols-1 gap-5  md:grid md:grid-cols-3 lg:gap-8">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Patients</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Days</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const timesFilter = times.filter(
                        (time) => time.dayId === value,
                      );
                      setFilterTime(timesFilter);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione un dia"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days?.map((day) => (
                        <SelectItem key={day.id} value={day.id}>
                          {day.weekday}
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
              name="time.startTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Inicio del turno</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione el inicio del turno"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterTime?.length === 0 ? (
                        <SelectItem value="">
                          No hay turnos disponibles
                        </SelectItem>
                      ) : (
                        filterTime?.map((time) => (
                          <SelectItem key={time.id} value={time.startTime}>
                            {time.startTime}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time.endTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Fin del turno</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione el fin del turno"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterTime?.length === 0 ? (
                        <SelectItem value="">
                          No hay turnos disponibles
                        </SelectItem>
                      ) : (
                        filterTime?.map((time) => (
                          <SelectItem key={time.id} value={time.endTime}>
                            {time.endTime}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="busy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ocupado</FormLabel>
                    <FormDescription>
                      Marcar este turno como ocupado
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
