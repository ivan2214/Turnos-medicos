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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PatientForm
          healthInsurances={healthInsurances}
          initialData={patient}
        />
      </div>
    </div>
  );
};

export default PatientPage;
