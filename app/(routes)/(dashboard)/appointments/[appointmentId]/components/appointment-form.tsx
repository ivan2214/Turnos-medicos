"use client";

import * as z from "zod";
import axios from "axios";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment, Day, Time, User } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

const formSchema = z.object({
  busy: z.boolean().default(false),
  dayId: z.string().uuid().min(1),
  userId: z.string().uuid().min(1),
  time: z.object({
    timeId: z.string().uuid().min(1).optional(),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  }),
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  initialData: Appointment | null;
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
      appointmentId: "",
      createdAt: new Date(),
      dayId: "",
      id: "",
    },
  ]);

  const createApointment = trpc.createApointment.useMutation();

  const title = initialData ? "Edit appointment" : "Create appointment";
  const description = initialData
    ? "Edit a appointment."
    : "Add a new appointment";
  const toastMessage = initialData
    ? "Appointment updated."
    : "Appointment created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        dayId: initialData.dayId ?? "",
        userId: initialData.userId ?? "",
      }
    : {
        busy: false,
        userId: "",
        time: {
          timeId: "",
          endTime: "",
        },
        dayId: "",
      };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      setLoading(true);

      createApointment.mutate(
        {
          dayId: data.dayId,
          userId: data.userId,
          busy: data.busy,
          time: {
            timeId: data?.time?.timeId,
            startTime: data?.time?.startTime,
            endTime: data?.time?.endTime,
          },
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: toastMessage,
              description: "Appointment updated.",
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
      router.push(`/appointments`);
      router.refresh();
      toast({
        title: toastMessage,
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/trpc/appointments/${params.appointmentId}`);
      router.refresh();
      router.push(`/appointments`);
      toast({
        title: "Appointment deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const { dayId } = form.getValues();

  useEffect(() => {
    const timesFilter = times.filter((time) => time.dayId == dayId);
    setFilterTime(timesFilter);
  }, [dayId, times]);

  console.log({ filterTime });
  console.log({ dayId });

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
          className="w-full space-y-8"
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
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione un usuario"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
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
                      {days.map((day) => (
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
                        <SelectItem key={time.id} value={time.id}>
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
                        <SelectItem key={time.id} value={time.id}>
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
                    <FormLabel>Busy</FormLabel>
                    <FormDescription>
                      This appointment will appear on the home page
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
