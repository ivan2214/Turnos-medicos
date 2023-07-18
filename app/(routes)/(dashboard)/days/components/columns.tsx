"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";

export type DayColumn = {
  id: string;
  day: string;
  createdAt: string;
};

export const columns: ColumnDef<DayColumn>[] = [
  {
    accessorKey: "day",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Dia
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("day")}</div>,
    sortingFn: (a, b) => {
      const { original: originalA } = a;
      const { day: DayAValue } = originalA;
      const { original: originalB } = b;
      const { day: DayBValue } = originalB;

      const indexA = daysOfWeek.indexOf(DayAValue);
      const indexB = daysOfWeek.indexOf(DayBValue);

      return indexA - indexB;
    },
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

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
