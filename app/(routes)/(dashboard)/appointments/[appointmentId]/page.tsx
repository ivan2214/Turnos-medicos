import prismadb from "@/app/libs/prismadb";

import { AppointmentForm } from "./components/appointment-form";
import { Appointment } from "@prisma/client";

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
      patient: true,
      time: true,
    },
  });

  const days = await prismadb.day.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const appointments = await prismadb.appointment.findMany();

  const times = await getAvailableTimes(appointments);

  const patients = await prismadb.patient.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full flex-col">
      <div className="w-full flex-1 space-y-4  py-6 lg:p-8 lg:py-0 lg:pt-6">
        <AppointmentForm
          times={times}
          days={days}
          patients={patients}
          initialData={appointment}
        />
      </div>
    </div>
  );
};

export default AppointmentPage;

const getAvailableTimes = async (appointments: Appointment[]) => {
  const occupiedTimeIds = appointments
    .map((appointment) => appointment.timeId)
    .filter((timeId) => timeId !== null) as string[];

  return await prismadb.time.findMany({
    orderBy: {
      startTime: "asc",
    },
    where: {
      id: { notIn: occupiedTimeIds },
    },
    include: {
      Appointment: true,
    },
  });
};
