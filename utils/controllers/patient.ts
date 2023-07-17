
import prisma from "@/app/libs/prismadb";
import { HealthInsurance } from "@prisma/client";

type TypeCreatePatient = {
  email: string
  name: string,
  healthInsuranceId?: string
}

export const getPatients = async () => {
  return prisma.patient.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      appointments: true
    },
  });
};

export const getPatient = async (patientId: string) => {
  return prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    include:
    {
      appointments: true
    }
  });
};
export const deletePatient = async (patientId: string) => {
  return prisma.patient.delete({
    where: {
      id: patientId,
    },
  });
};




export const createPatient = async ({
  email,
  name,
  healthInsuranceId
}: TypeCreatePatient) => {
  const patientAlreadyExistins = await prisma.patient.findUnique({
    where: {
      email,
      name
    },
  });

  if (patientAlreadyExistins) {
    throw new Error("El usuario ya existe");
  }


  let healthInsurance: HealthInsurance | null | undefined

  if (healthInsuranceId && healthInsuranceId !== undefined && healthInsuranceId !== null && healthInsuranceId !== "" && healthInsuranceId !== "undefined") {
    healthInsurance = await prisma.healthInsurance.findUnique({
      where: {
        id: healthInsuranceId
      }
    })
  }


  if (healthInsurance && healthInsurance !== undefined && healthInsurance !== null) {
    await prisma.patient.create({
      data: {
        email,
        name,
        healthInsuranceId: healthInsurance.id
      }
    });
  } else if (!healthInsurance && healthInsurance === null || healthInsurance === undefined) {
    await prisma.patient.create({
      data: {
        email,
        name,
      }
    });
  }

  return ({
    status: 201,
    data: "ok"
  })
};
