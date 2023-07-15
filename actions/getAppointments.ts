
import prisma from "@/app/libs/prismadb"

export interface IAppointmentsParams {
  dayId?: number;
  patientId?: number;
  busy: boolean;
  startTime?: string;
  endTime?: string;
}

export default async function getAppointments(
  params: IAppointmentsParams
) {
  try {
    const {
      patientId,
      busy,
      startTime,
      endTime,
      dayId
    } = params;

    let query: any = {};

    if (patientId) {
      query.patientId = patientId;
    }

    if (busy) {
      query.busy = busy;
    }

    if (startTime && endTime) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endTime: { gte: startTime },
                startTime: { lte: startTime }
              },
              {
                startTime: { lte: endTime },
                endTime: { gte: endTime }
              }
            ]
          }
        }
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: query,
      orderBy: {
        day: {
          weekday: "asc"
        }
      }
    });

    const safeAppointments = appointments.map((appointment) => ({
      ...appointment,
    }));

    return { safeAppointments };
  } catch (error: any) {
    throw new Error(error);
  }
}
