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

export const getApointment = async (appointmentId: number) => {
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
  patientId: number,
  startTimeId: number,
  endTimeId: number,
  dayId: number
) => {
  if (!startTimeId || !endTimeId || !patientId || !dayId) {
    throw new Error("El formulario no es valido");
  }

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });

  const turn = await prisma.appointment.findFirst({
    where: {
      dayId: dayId,
    },
  });

  if (!patient) {
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
        patientId: patient.id,
        dayId
      },
    });

    return await prisma.patient.update({
      where: {
        id: patient.id,
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
        patientId: patient.id,
      },
    });
  }
};

