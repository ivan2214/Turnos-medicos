import prisma from "@/app/libs/prismadb";

import { PatientClient } from "./components/client";
import { PatientColumn } from "./components/columns";

export const revalidate = 0; // revalidate this page every 60 seconds

const page = async () => {
  const patients = await prisma.patient.findMany({
    include: {
      healthInsurance: true,
      appointments: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedPatients: PatientColumn[] = patients?.map((item) => ({
    id: item.id,
    name: item.name ?? "",
    email: item.email ?? "",
    healthInsurance: item.healthInsurance?.name ?? "",
  }));

  return (
    <div className="flex-col overflow-x-hidden">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PatientClient  data={formattedPatients} />
      </div>
    </div>
  );
};

export default page;
