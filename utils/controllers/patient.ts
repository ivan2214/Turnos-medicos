import prismadb from "@/lib/prismadb";

export const getPatients = async () => {
  return prismadb.patient.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      appointments: true,
    },
  });
};

export const getPatient = async (patientId: number) => {
  return prismadb.patient.findUnique({
    where: {
      id: patientId,
    },
  });
};


export const createPatient = async (fullName: string, email: string) => {
  const patient = await prismadb.patient.findUnique({
    where: {
      email: email,
    },
  });

  if (patient) {
    throw new Error("El paciente ya existe");
  }

  return prismadb.patient.create({
    data: {
      name: fullName,
      email: email,
    },
  });
};
