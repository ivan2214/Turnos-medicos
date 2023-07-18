"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { PatientColumn, columns } from "./columns";

interface PatientsClientProps {
  data: PatientColumn[];
}

export const PatientClient: React.FC<PatientsClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <Heading
          title={`Usuarios (${data?.length})`}
          description="Gestiona los usuarios de su consultorio"
        />
        <Button onClick={() => router.push(`/patients/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir nuevo
        </Button>
      </div>
      <Separator />
      <div className=" h-full flex-1 flex-col overflow-x-hidden p-8 md:flex">
        <DataTable
          query="Nombre del paciente"
          searchKey="name"
          columns={columns}
          data={data}
        />
      </div>
      {process.env.NODE_ENV === "development" && (
        <>
          <Heading title="API" description="API Calls for Patients" />
          <Separator />
          <ApiList
            entityName="patients"
            entityIdName={["startPatientId", "endPatientId", "dayId"]}
          />
        </>
      )}
    </>
  );
};
