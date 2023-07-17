"use client";

import { Appointment, Patient } from "@prisma/client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  patients: Patient[];
  appointments: Appointment[];
}

export function Overview({ patients, appointments }: Props) {
  // Generar los datos para el gráfico a partir de los usuarios y citas
  const data = patients.map((patient, index) => {
    const totalAppointments = appointments.filter(
      (appointment) => appointment.patientId === patient.id,
    ).length;

    return {
      name: patient.name,
      total: totalAppointments,
      index: index + 1,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: any) => value}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            border: "none",
            borderRadius: "4px",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
