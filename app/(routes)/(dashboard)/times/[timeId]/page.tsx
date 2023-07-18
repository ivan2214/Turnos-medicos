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
    <div className="w-full flex-col">
      <div className="w-full flex-1 space-y-4  py-6 lg:p-8 lg:py-0 lg:pt-6">
        <TimeForm days={days} initialData={time} />
      </div>
    </div>
  );
};

export default TimePage;
