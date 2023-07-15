import prisma from "@/app/libs/prismadb";


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



export const createApointment = async (
  userId: string,
  startTimeId: string,
  endTimeId: string,
  dayId: string
) => {
  if (!startTimeId || !endTimeId || !userId || !dayId) {
    throw new Error("El formulario no es valido");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const turn = await prisma.appointment.findFirst({
    where: {
      dayId: dayId,
    },
  });

  if (!user) {
    throw new Error("El paciente no fue encontrado");
  }

  if (turn?.busy) {
    throw new Error("El turno ya fue tomado");
  }

  if (!!turn) {
    await prisma.appointment.update({
      where: {
        id: turn.id,
      },
      data: {
        busy: true,
        userId: user.id,
        dayId
      },
    });

    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        appointments: {
          connectOrCreate: {
            create: {
              dayId: dayId,
              busy: true,
            },
            where: { id: turn?.id },
          },
        },
      },
    });
  } else {
    await prisma.appointment.create({
      data: {
        dayId: dayId,
        busy: true,
        userId: user.id,
      },
    });
  }
};

