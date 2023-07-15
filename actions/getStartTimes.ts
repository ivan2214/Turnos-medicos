import { StartTime } from '@prisma/client';
import prisma from "@/app/libs/prismadb"

export const getStartTimes = async () => {
  const startTimes: (StartTime & {})[] = await prisma.startTime.findMany({
    orderBy: {
      time: "asc"
    }
  });

  if (!startTimes) {
    return { turns: [] };
  }

  return { startTimes };
}