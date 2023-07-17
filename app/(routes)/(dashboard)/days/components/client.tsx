"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { DayColumn, columns } from "./columns";

interface DaysClientProps {
  data: DayColumn[];
}

export const DayClient: React.FC<DaysClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <Heading
          title={`Dias (${data?.length})`}
          description="Gestiona los dias de tu consultorio"
        />
        <Button onClick={() => router.push(`/days/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir nuevo
        </Button>
      </div>
      <Separator />
      <div className="hidden h-full flex-1 flex-col overflow-x-hidden p-8 md:flex">
        <DataTable
          query="Dia de la semana"
          searchKey="day"
          columns={columns}
          data={data}
        />
      </div>
      {process.env.NODE_ENV === "development" && (
        <>
          <Heading title="API" description="API Calls for Days" />
          <Separator />
          <ApiList
            entityName="days"
            entityIdName={["startDayId", "endDayId", "dayId"]}
          />
        </>
      )}
    </>
  );
};
