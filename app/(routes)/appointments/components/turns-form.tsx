"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

import { User, Appointment, Day, StartTime, EndTime } from "@prisma/client";

import { useFilteredTurns } from "@/hooks/useFilteredTurns";
import { es } from "date-fns/locale";

const FormSchema = z.object({
  weekday: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string().nonempty({
    message: "A start time is required.",
  }),
  endTime: z.string().nonempty({
    message: "An end time is required.",
  }),
});

type Props = {
  user: User | undefined;
  appointments: Appointment[] | undefined | null;
  days: Day[];
  startTimes: StartTime[] | undefined | null;
  endTimes: EndTime[] | undefined | null;
};

export function TurnsForm({
  user,
  appointments,
  days,
  startTimes,
  endTimes,
}: Props) {
  const appointmentOfUserMutation = trpc.createApointment.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);

  /*   const filteredTurns = useFilteredTurns({
    appointments,
    startTime: form.watch("startTime"),
  }); */

  const selectedFecha = form.watch("weekday");
  const formattedFecha = selectedFecha ? format(selectedFecha, "PPP") : "";
  const selectedDay = days.find((day) => day.weekday === formattedFecha);

  console.log({ startTimes });

  /*   const filteredDays = days.filter((day) => {
    const dayTurns = appointments.filter(
      (appointment) => appointment.dayId === day.id,
    );
    const availableTurns = day.weekday.filter(
      (startTime) =>
        !dayTurns.some(
          (appointment) =>
            appointment.dayId === day.id && appointment.busy === false,
        ),
    );
    return availableTurns.length > 0;
  }); */

  /*   const filteredTurnsByDay = selectedDay
    ? filteredTurns.filter(
        (appointment) => appointment.dayId === selectedDay.id,
      )
    : []; */

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*  appointmentOfUserMutation.mutate(
      {
        userId: Number(user?.id),
        weekday: format(data.weekday, "PPP"),
        dayId: data.weekday,
        endTimeId: data.endTime,
        startTimeId: data.startTime,
      },
      {
        onSuccess(data) {
          console.log({ data });
        },
      },
    );
 */
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-primary p-4  dark:bg-primary-foreground">
          <code className="text-primary-foreground dark:text-gray-300">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  const isInvalid = (time: string): boolean => {
    const weekday = form.watch("weekday");

    if (!weekday) {
      return false;
    }

    /*    const startTimeFilter = startTimes.filter((appointment) => {
      const day = days.find((day) => day.id === appointment.dayId);
      if (day) return day === format(weekday, "DDD");
    }); */

    return false;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4 rounded-lg px-5 py-5 dark:bg-zinc-800"
      >
        <FormField
          control={form.control}
          name="weekday"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha del appointment</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field?.value && "text-muted-foreground",
                      )}
                    >
                      {field?.value ? (
                        format(field?.value, "PPP")
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    fromYear={2023}
                    locale={es}
                    mode="single"
                    selected={field?.value}
                    //@ts-expect-error
                    onSelect={field?.onChange}
                    disabled={(date) => {
                      return date > nextMonth || date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="font-light text-secondary-foreground  dark:text-gray-600">
                Seleccione su fecha para appointment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario de Inicio</FormLabel>
              <Select
                onValueChange={field?.onChange}
                defaultValue={field?.value}
              >
                <FormControl className="placeholder:text-gray-300 dark:text-gray-300">
                  <SelectTrigger>
                    <SelectValue
                      className="placeholder:text-gray-300 dark:text-gray-300"
                      placeholder="17:00"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {startTimes?.map(({ time, dayId, id }) => (
                    <SelectItem
                      disabled={isInvalid(time)}
                      key={id}
                      className="dark:placeholder:text-secondary-foreground"
                      value={time}
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="font-light text-secondary-foreground  dark:text-gray-600">
                Seleccione una hora de inicio
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario de Fnial</FormLabel>
              <Select
                onValueChange={field?.onChange}
                defaultValue={field?.value}
              >
                <FormControl className="placeholder:text-gray-300 dark:text-gray-300">
                  <SelectTrigger>
                    <SelectValue
                      className="placeholder:text-gray-300 dark:text-gray-300"
                      placeholder="21:00"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {endTimes?.map(({ time, dayId, id }) => (
                    <SelectItem
                      disabled={isInvalid(time)}
                      key={id}
                      className="dark:placeholder:text-secondary-foreground"
                      value={time}
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="font-light text-secondary-foreground  dark:text-gray-600">
                Seleccione una hora de final
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
