import { EndTime } from '@prisma/client';
import prisma from "@/app/libs/prismadb"

export const getEndTimes = async () => {
  const endTimes: (EndTime & {})[] = await prisma.endTime.findMany({
    orderBy: {
      time: "asc"
    }
  });

  if (!endTimes) {
    return { turns: [] };
  }

  return { endTimes };
}