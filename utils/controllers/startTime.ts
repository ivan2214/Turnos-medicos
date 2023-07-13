import prismadb from "@/lib/prismadb";

export const getStartTimes = async () => {
  return prismadb.startTime.findMany({
    orderBy: {
      time: "asc"
    },
    include: {
      Day: true

    },
  });
};

export const getStartTime = async (startTimeId: number) => {
  return prismadb.startTime.findUnique({
    where: {
      id: startTimeId,
    },
  });
};


export const createStartTime = async (startTime: string) => {
  const startTimeAlreadyExistins = await prismadb.startTime.findUnique({
    where: {
      time: startTime
    },
  });

  if (startTimeAlreadyExistins) {
    throw new Error("El dia ya existe");
  }

  return prismadb.startTime.create({
    data: {
      time: startTime,
    },
  });
};
