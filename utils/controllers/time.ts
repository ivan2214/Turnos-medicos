import prisma from "@/app/libs/prismadb";

export const getTimes = async () => {
  return prisma.time.findMany({
    orderBy: {
      startTime: "asc",
      endTime: "desc"
    },
    include: {
      Day: true
    },
  });
};

export const getTime = async (timeId: string) => {
  return prisma.time.findUnique({
    where: {
      id: timeId,
    },
  });
};
export const deleteTime = async (timeId: string) => {
  return prisma.time.delete({
    where: {
      id: timeId,
    },
  });
};


type Time = {
  startTime: string
  endTime: string
}

export const createTime = async (time: Time, dayId: string, timeId?: string) => {

  if (timeId) {
    const timeAlreadyExists = await prisma.time.findUnique({
      where: {
        id: timeId
      },
    });
    if (timeAlreadyExists) {
      throw new Error("El tiempo ya existe");
    }
  }

  return prisma.time.create({
    data: {
      dayId: dayId,
      startTime: time.startTime,
      endTime: time.endTime
    }
  });
};
