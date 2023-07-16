import prismadb from "@/app/libs/prismadb";

import { TimeForm } from "./components/time-form";

const TimePage = async ({ params }: { params: { timeId: string } }) => {
  const time = await prismadb.time.findUnique({
    where: {
      id: params.timeId,
    },
    include: {
      Day: true,
    },
  });

  const days = await prismadb.day.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TimeForm days={days} initialData={time} />
      </div>
    </div>
  );
};

export default TimePage;
