import prismadb from "@/lib/prismadb";

export const getDays = async () => {
  return prismadb.day.findMany({
    orderBy: {
      weekday: "asc",
    },
    include: {
      appointments: true,
    },
  });
};

export const getDay = async (dayId: number) => {
  return prismadb.day.findUnique({
    where: {
      id: dayId,
    },
  });
};


export const createDay = async (weekday: string,) => {
  const day = await prismadb.day.findUnique({
    where: {
      weekday: weekday,
    },
  });

  if (day) {
    throw new Error("El dia ya existe");
  }

  return prismadb.day.create({
    data: {
      weekday: weekday,
    },
  });
};
