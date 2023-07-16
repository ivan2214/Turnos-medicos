"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { TimeColumn, columns } from "./columns";

interface TimesClientProps {
  data: TimeColumn[];
}

export const TimeClient: React.FC<TimesClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Horarios (${data?.length})`}
          description="Gestiona las citas de tu consultorio"
        />
        <Button onClick={() => router.push(`/times/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="startTime" columns={columns} data={data} />
      {process.env.NODE_ENV === "development" && (
        <>
          <Heading title="API" description="API Calls for Times" />
          <Separator />
          <ApiList
            entityName="times"
            entityIdName={["startTimeId", "endTimeId", "dayId"]}
          />
        </>
      )}
    </>
  );
};
