import prismadb from "@/app/libs/prismadb";

import { AppointmentForm } from "./components/appointment-form";

const AppointmentPage = async ({
  params,
}: {
  params: { appointmentId: string };
}) => {
  const appointment = await prismadb.appointment.findUnique({
    where: {
      id: params.appointmentId,
    },
    include: {
      day: true,
      user: true,
    },
  });

  const days = await prismadb.day.findMany({
    orderBy: {
      weekday: "asc",
    },
  });

  const users = await prismadb.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AppointmentForm days={days} users={users} initialData={appointment} />
      </div>
    </div>
  );
};

export default AppointmentPage;
