import { format } from "date-fns";

import prisma from "@/app/libs/prismadb";

import { DayClient } from "./components/client";
import { DayColumn } from "./components/columns";

export const revalidate = 60; // revalidate this page every 60 seconds

const page = async () => {
  const days = await prisma.day.findMany({
    include: {
      appointments: true,
      Time: true,
    },
    orderBy: {
      weekday: "asc",
    },
  });

  const formattedDays: DayColumn[] = days?.map((item) => ({
    id: item.id,
    day: item.weekday,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DayClient data={formattedDays} />
      </div>
    </div>
  );
};

export default page;
