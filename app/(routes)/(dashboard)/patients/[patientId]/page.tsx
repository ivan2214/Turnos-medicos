import prismadb from "@/app/libs/prismadb";

import { PatientForm } from "./components/patient-form";
import { HealthInsurance } from "@prisma/client";

const PatientPage = async ({ params }: { params: { patientId: string } }) => {
  const patient = await prismadb.patient.findUnique({
    where: {
      id: params.patientId,
    },
    include: {
      healthInsurance: true,
    },
  });

  const healthInsurances: HealthInsurance[] | null | undefined =
    await prisma?.healthInsurance.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="w-full flex-col">
      <div className="w-full flex-1 space-y-4  py-6 lg:p-8 lg:py-0 lg:pt-6">
        <PatientForm
          healthInsurances={healthInsurances}
          initialData={patient}
        />
      </div>
    </div>
  );
};

export default PatientPage;
