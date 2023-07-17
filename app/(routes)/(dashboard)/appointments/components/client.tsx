"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { AppointmentColumn, columns } from "./columns";

interface AppointmentsClientProps {
  data: AppointmentColumn[];
}

export const AppointmentsClient: React.FC<AppointmentsClientProps> = ({
  data,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <Heading
          title={`Turnos (${data.length})`}
          description="Gestiona las citas de tu consultorio"
        />
        <Button onClick={() => router.push(`/appointments/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Turnos" />
      <Separator />
      <ApiList entityName="appointments" entityIdName="appointmentId" />
    </>
  );
};
