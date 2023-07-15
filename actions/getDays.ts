import { Day } from '@prisma/client';
import prisma from "@/app/libs/prismadb"

export const getDays = async () => {
  const days: (Day & {})[] = await prisma.day.findMany({
    orderBy: {
      weekday: "asc"
    }
  });

  if (!days) {
    return { days: [] };
  }

  return { days };
}