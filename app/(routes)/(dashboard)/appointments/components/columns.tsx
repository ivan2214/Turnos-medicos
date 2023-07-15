"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Day, User } from "@prisma/client";

export type AppointmentColumn = {
  id: string;
  busy: boolean;
  user: string;
  day: string;
  createdAt: string;
};

export const columns: ColumnDef<AppointmentColumn>[] = [
  {
    accessorKey: "busy",
    header: "Busy",
  },
  {
    accessorKey: "day",
    header: "Day",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "startTime",
    header: "StartTime",
  },
  {
    accessorKey: "endTime",
    header: "EndtTime",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
