import { Appointment } from '@prisma/client';
import prismadb from "@/lib/prismadb"

export const getAppointments = async () => {
  const appointments: (Appointment & {})[] = await prismadb.appointment.findMany({
    orderBy: {
      day: {
        weekday: "asc"
      }
    }
  });

  if (!appointments) {
    return { appointments: [] };
  }

  return { appointments };
}