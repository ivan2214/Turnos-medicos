"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type TimeColumn = {
  id: string;
  startTime: string;
  endTime: string;
  day: string;
  createdAt: string;
};

export const columns: ColumnDef<TimeColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "startTime",
    header: "Comienza",
  },
  {
    accessorKey: "endTime",
    header: "Termina",
  },
  {
    accessorKey: "day",
    header: "Dia",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
