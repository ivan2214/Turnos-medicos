import { EndTime } from '@prisma/client';
import prismadb from "@/lib/prismadb"

export const getEndTimes = async () => {
  const endTimes: (EndTime & {})[] = await prismadb.endTime.findMany({
    orderBy: {
      time: "asc"
    }
  });

  if (!endTimes) {
    return { turns: [] };
  }

  return { endTimes };
}