import { Day } from '@prisma/client';
import prismadb from "@/lib/prismadb"

export const getDays = async () => {
  const days: (Day & {})[] = await prismadb.day.findMany({
    orderBy: {
      weekday: "asc"
    }
  });

  if (!days) {
    return { days: [] };
  }

  return { days };
}