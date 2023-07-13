import prismadb from "@/lib/prismadb";


export const getAppointments = async () => {
  const appointments = await prismadb.appointment.findMany({
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


  const appointment = prismadb.appointment.findMany({
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

  const patient = await prismadb.patient.findUnique({
    where: {
      id: patientId,
    },
  });

  const turn = await prismadb.appointment.findFirst({
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
    await prismadb.appointment.update({
      where: {
        id: turn.id,
      },
      data: {
        busy: true,
        patientId: patient.id,
        dayId
      },
    });

    return await prismadb.patient.update({
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
    await prismadb.appointment.create({
      data: {
        dayId: dayId,
        busy: true,
        patientId: patient.id,
      },
    });
  }
};

