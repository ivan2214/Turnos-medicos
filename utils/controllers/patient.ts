import prisma from "@/app/libs/prismadb";

export const getPatients = async () => {
  return prisma.patient.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      appointments: true,
    },
  });
};

export const getPatient = async (patientId: number) => {
  return prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });
};


export const createPatient = async (fullName: string, email: string) => {
  const patient = await prisma.patient.findUnique({
    where: {
      email: email,
    },
  });

  if (patient) {
    throw new Error("El paciente ya existe");
  }

  return prisma.patient.create({
    data: {
      name: fullName,
      email: email,
    },
  });
};
