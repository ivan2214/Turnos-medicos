import prisma from "@/app/libs/prismadb";

export const getDays = async () => {
  return prisma.day.findMany({
    orderBy: {
      weekday: "asc",
    },
    include: {
      appointments: true,
      Time: true
    },
  });
};

export const getDay = async (dayId: string) => {
  return prisma.day.findUnique({
    where: {
      id: dayId,
    },
  });
};


export const createDay = async (weekday: string,) => {
  const day = await prisma.day.findUnique({
    where: {
      weekday: weekday,
    },
  });

  if (day) {
    throw new Error("El dia ya existe");
  }

  return prisma.day.create({
    data: {
      weekday: weekday,
    },
  });
};
