import { format } from "date-fns";

import prisma from "@/app/libs/prismadb";

import { AppointmentsClient } from "./components/client";
import { AppointmentColumn } from "./components/columns";

export const revalidate = 60; // revalidate this page every 60 seconds

const page = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      day: true,
      patient: true,
      time: true,
    },
    orderBy: {
      day: {
        weekday: "asc",
      },
    },
  });

  const formattedAppointments: AppointmentColumn[] = appointments?.map(
    (item) => ({
      id: item.id.toString(),
      busy: Boolean(item.busy),
      name: item.patient?.name ? item.patient.name || "" : "",
      email: item.patient?.email ? item.patient.email || "" : "",
      day: item.day ? item.day.weekday || "" : "",
      startTime: item.time ? item.time.startTime || "" : "",
      endTime: item.time ? item.time.endTime || "" : "",
    }),
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AppointmentsClient data={formattedAppointments} />
      </div>
    </div>
  );
};

export default page;
