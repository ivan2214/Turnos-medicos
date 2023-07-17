import prisma from "@/app/libs/prismadb";
import { Appointment } from "@prisma/client";


export const getAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      day: {
        weekday: "asc"
      }
    },
  });

  if (!appointments) throw new Error("No appointments found");

  return appointments
};

export const getApointment = async (appointmentId: string) => {
  if (!appointmentId) return null;


  const appointment = prisma.appointment.findMany({
    where: {
      id: appointmentId,
    },
    orderBy: {
      day: {
        weekday: "asc"
      }
    },
  });

  if (!appointment) throw new Error("No appointment found");

  return appointment
};


type TimeProp = {
  timeId?: string
  startTime: string
  endTime: string
}

export const createAppointment = async (
  userId: string,
  dayId: string,
  busy: boolean,
  timeProp: TimeProp
) => {
  console.log("createAppointment", userId, dayId, busy, timeProp);
  if (!userId || !dayId || !busy || !timeProp || !timeProp.startTime || !timeProp.endTime || !timeProp.timeId) {
    throw new Error("El formulario no es valido");
  }

  const day = await prisma.day.findUnique({
    where: {
      id: dayId,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const appointment: Appointment | null = await prisma.appointment.findFirst({
    where: {
      dayId: dayId,
    },
  });

  const time = await prisma.time.findUnique({
    where: {
      id: timeProp.timeId
    }
  })

  const timeUpdate = await prisma.time.findFirst({
    where: {
      startTime: timeProp.startTime,
      endTime: timeProp.endTime
    }
  })

  console.log({ timeUpdate });


  if (!user) {
    throw new Error("El paciente no fue encontrado");
  }

  if (!day) {
    throw new Error("El dia no fue encontrado");
  }

  if (!time) {
    throw new Error("El tiempo no fue encontrado");
  }

  if (appointment && time) {
    return await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        busy: busy,
        userId: user.id,
        dayId: day.id,
        timeId: time.id
      },
    });
  }

  return await prisma.appointment.create({
    data: {
      dayId: day.id,
      busy: busy,
      userId: user.id,
      timeId: timeProp.timeId,
    },
  });

};

