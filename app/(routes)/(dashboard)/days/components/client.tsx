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
      <div className="flex flex-col items-start gap-5 justify-between lg:flex-row">
        <Heading
          title={`Horarios (${data?.length})`}
          description="Gestiona las citas de tu consultorio"
        />
        <Button onClick={() => router.push(`/days/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="startDay" columns={columns} data={data} />
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
