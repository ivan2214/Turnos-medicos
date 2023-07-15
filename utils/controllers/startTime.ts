import prisma from "@/app/libs/prismadb";

export const getStartTimes = async () => {
  return prisma.startTime.findMany({
    orderBy: {
      time: "asc"
    },
    include: {
      Day: true

    },
  });
};

export const getStartTime = async (startTimeId: number) => {
  return prisma.startTime.findUnique({
    where: {
      id: startTimeId,
    },
  });
};


export const createStartTime = async (startTime: string) => {
  const startTimeAlreadyExistins = await prisma.startTime.findUnique({
    where: {
      time: startTime
    },
  });

  if (startTimeAlreadyExistins) {
    throw new Error("El dia ya existe");
  }

  return prisma.startTime.create({
    data: {
      time: startTime,
    },
  });
};
