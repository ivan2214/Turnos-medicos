import { StartTime } from '@prisma/client';
import prismadb from "@/lib/prismadb"

export const getStartTimes = async () => {
  const startTimes: (StartTime & {})[] = await prismadb.startTime.findMany({
    orderBy: {
      time: "asc"
    }
  });

  if (!startTimes) {
    return { turns: [] };
  }

  return { startTimes };
}