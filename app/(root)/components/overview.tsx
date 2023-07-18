"use client";

import { Appointment, Day } from "@prisma/client";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Props {
  days: Day[];
  appointments: Appointment[];
}

export function Overview({ appointments, days }: Props) {
  const dayCounts: { [dayId: string]: number } = {};

  days.forEach((day) => {
    dayCounts[day.id] = 0;
  });

  appointments.forEach((appointment) => {
    const dayId = appointment.dayId;
    if (dayId) {
      dayCounts[dayId] += 1;
    }
  });

  const data = days.map((day, index) => {
    const count = dayCounts[day.id];

    return {
      name: day.weekday,
      total: count,
      fill: generateColor(index), // Generar un color único para cada barra
    };
  });

  const yValues = data.map((item) => Number(item.total));
  const yDomain = [0, Math.max(...yValues)];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis
          tickFormatter={(value: any) => String(Math.round(value))}
          domain={yDomain}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
        <Bar dataKey="total" barSize={30} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function generateColor(index: number): string {
  // Generar colores aleatorios basados en el índice
  const colors = ["#adfa1d", "#ff5500", "#00aaff", "#ff00aa", "#55ff00"];
  return colors[index % colors.length];
}
