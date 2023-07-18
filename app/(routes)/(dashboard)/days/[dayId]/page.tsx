import prismadb from "@/app/libs/prismadb";

import { DayForm } from "./components/day-form";

const DayPage = async ({ params }: { params: { dayId: string } }) => {
  const day = await prismadb.day.findUnique({
    where: {
      id: params.dayId,
    },
  });

  return (
    <div className="w-full flex-col">
      <div className="w-full flex-1 space-y-4  py-6 lg:p-8 lg:py-0 lg:pt-6">
        <DayForm initialData={day} />
      </div>
    </div>
  );
};

export default DayPage;
