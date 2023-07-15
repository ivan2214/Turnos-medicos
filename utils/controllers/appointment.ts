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
  dayId: string,
  busy: boolean
) => {
  if (!userId || !dayId || !busy) {
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

  const appointment = await prisma.appointment.findFirst({
    where: {
      dayId: dayId,
    },
  });

  if (!user) {
    throw new Error("El paciente no fue encontrado");
  }

  if (!day) {
    throw new Error("El dia no fue encontrado");
  }

  if (appointment?.busy) {
    throw new Error("El turno ya fue tomado");
  }

  if (!!appointment) {
    await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        busy: busy,
        userId: user.id,
        dayId: day.id
      },
    });

    /*  return await prisma.user.update({
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
             where: { id: appointment?.id },
           },
         },
       },
     }); */
  } else {
    await prisma.appointment.create({
      data: {
        dayId: day.id,
        busy: busy,
        userId: user.id,
      },
    });
  }
};

