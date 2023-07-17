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
import { Time, Day, Appointment, User } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  userId: z.string().uuid().min(1),
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
  user: User | null;
  userId: string | null;
  day: Day | null;
  dayId: string | null;
  time: Time | null;
  timeId: string | null;
}

interface AppointmentFormProps {
  initialData: InitialDate | null;
  users: User[];
  days: Day[];
  times: Time[];
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  days,
  users,
  times,
}) => {
  const params = useParams();
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
        userId: initialData.userId ?? "",
        time: {
          timeId: initialData.time?.id,
          startTime: initialData.time?.startTime,
          endTime: initialData.time?.endTime,
        },
      }
    : {
        busy: false,
        userId: "",
        time: {
          timeId: "",
          startTime: "",
          endTime: "",
        },
        dayId: "",
      };

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
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
          userId: data.userId,
          busy: data.busy,
          time: {
            timeId: timeEquals.id,
            startTime: data.time.startTime,
            endTime: data.time.endTime,
          },
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "You submitted the following values:",
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">
                    {JSON.stringify(data, null, 2)}
                  </code>
                </pre>
              ),
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
              title: "Turno eliminado.",
              description: "Turno actualizado.",
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
      router.push(`/times`);
      router.refresh();
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
          className="w-2/3 space-y-6"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Users</FormLabel>
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
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
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
                <FormItem>
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
                <FormItem>
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
                          placeholder="Seleccione un dia"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterTime?.map((time) => (
                        <SelectItem key={time.id} value={time.startTime}>
                          {time.startTime}
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
              name="time.endTime"
              render={({ field }) => (
                <FormItem>
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
                          placeholder="Seleccione un dia"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterTime?.map((time) => (
                        <SelectItem key={time.id} value={time.endTime}>
                          {time.endTime}
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
