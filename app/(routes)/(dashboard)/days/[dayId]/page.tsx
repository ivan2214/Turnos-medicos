import prismadb from "@/app/libs/prismadb";

import { DayForm } from "./components/day-form";

const DayPage = async ({ params }: { params: { dayId: string } }) => {
  const day = await prismadb.day.findUnique({
    where: {
      id: params.dayId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DayForm initialData={day} />
      </div>
    </div>
  );
};

export default DayPage;
