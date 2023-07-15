import { format } from "date-fns";

import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

import prisma from "@/app/libs/prismadb";

import { AppointmentsClient } from "./components/client";
import { AppointmentColumn } from "./components/columns";

const page = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      day: true,
      user: true,
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
      user: item.user ? item.user.name || "" : "",
      day: item.day ? item.day.weekday || "" : "",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
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
