import { format } from "date-fns";

import prisma from "@/app/libs/prismadb";

import { TimeClient } from "./components/client";
import { TimeColumn } from "./components/columns";

export const revalidate = 0; // revalidate this page every 60 seconds

const page = async () => {
  const times = await prisma.time.findMany({
    include: {
      Day: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const formattedTimes: TimeColumn[] = times?.map((item) => ({
    id: item.id.toString(),
    startTime: item.startTime,
    endTime: item.endTime,
    day: item.Day?.weekday || "",
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TimeClient data={formattedTimes} />
      </div>
    </div>
  );
};

export default page;
