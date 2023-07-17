"use client";

import { ColumnDef, SortingColumn, SortingFn } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";

export type DayColumn = {
  id: string;
  weekday: string;
  createdAt: string;
};

const days = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const sortByWeekday: SortingFn<DayColumn> = (rowA, rowB, columnId) => {
  const dayA = days.indexOf(rowA.original.weekday.toLowerCase());
  const dayB = days.indexOf(rowB.original.weekday.toLowerCase());

  if (dayA < dayB) {
    return -1;
  } else if (dayA > dayB) {
    return 1;
  } else {
    return 0;
  }
};

export const columns: ColumnDef<DayColumn>[] = [
  {
    accessorKey: "day",
    header: ({ column }) => {
      const sortingColumn = column as SortingColumn<DayColumn>;
      const isSorted = sortingColumn.getIsSorted();
      const sortDirection = isSorted
        ? isSorted === "asc"
          ? "desc"
          : "asc"
        : undefined;

      return (
        <Button
          variant="ghost"
          onClick={() => sortingColumn.toggleSorting(undefined, false)}
        >
          Dia
          {isSorted && (
            <ArrowUpDownIcon
              className={`ml-2 h-4 w-4 ${
                sortDirection === "desc" ? "rotate-180 transform" : ""
              }`}
            />
          )}
        </Button>
      );
    },
    sortingFn: sortByWeekday,
    cell: ({ row }) => <div className="lowercase">{row.getValue("day")}</div>,
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
