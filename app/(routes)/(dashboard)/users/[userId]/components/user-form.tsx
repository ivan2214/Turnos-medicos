"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
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
import { Time, Day } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

const formSchema = z.object({
  dayId: z.string().uuid().min(1),
  time: z.object({
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  }),
});

type TimeFormValues = z.infer<typeof formSchema>;

interface TimeFormProps {
  initialData: Time | null;
  days: Day[] | null | undefined;
}

export const TimeForm: React.FC<TimeFormProps> = ({ initialData, days }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createTime = trpc.createTime.useMutation();
  const deleteTime = trpc.deleteTime.useMutation();

  const title = initialData ? "Edit time" : "Create time";
  const description = initialData ? "Edit a time." : "Add a new time";
  const toastMessage = initialData ? "Time updated." : "Time created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        time: {
          startTime: initialData.startTime,
          endTime: initialData.endTime,
        },
        dayId: initialData.dayId ?? "",
      }
    : {
        time: {
          startTime: "",
          endTime: "",
        },
        dayId: "",
      };

  const form = useForm<TimeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: TimeFormValues) => {
    try {
      setLoading(true);

      createTime.mutate(
        {
          time: data.time,
          dayId: data.dayId,
          timeId: initialData?.id,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: toastMessage,
              description: "Time updated.",
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
      router.push(`/times`);
      router.refresh();

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
      deleteTime.mutate(
        {
          timeId: initialData?.id!,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "Time deleted.",
              description: "Time updated.",
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
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="time.startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comienza</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="17:00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Porfavor ponga el horario en el que comienza el turno
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time.endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termina</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="17:30" {...field} />
                  </FormControl>
                  <FormDescription>
                    Porfavor ponga el horario en el que finaliza el turno
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia</FormLabel>
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
