import { addMonths, startOfMonth, subMonths } from "date-fns";
import prisma from "@/app/libs/prismadb";

export async function getNewPatientsData() {
  const currentDate = new Date();
  const lastMonthDate = subMonths(currentDate, 1);

  const newPatientsThisMonth = await prisma.patient.count({
    where: {
      createdAt: {
        gte: startOfMonth(currentDate), // Obtener pacientes creados después del inicio del mes actual
        lt: startOfMonth(addMonths(currentDate, 1)), // Obtener pacientes creados antes del inicio del próximo mes
      },
    },
  });

  const newPatientsLastMonth = await prisma.patient.count({
    where: {
      createdAt: {
        gte: startOfMonth(lastMonthDate), // Obtener pacientes creados después del inicio del mes pasado
        lt: startOfMonth(currentDate), // Obtener pacientes creados antes del inicio del mes actual
      },
    },
  });

  let percentageIncrease = 0; // Inicializar el porcentaje de aumento a cero

  if (newPatientsLastMonth !== 0) {
    percentageIncrease =
      ((newPatientsThisMonth - newPatientsLastMonth) / newPatientsLastMonth) *
      100;
  }

  return {
    newPatientsThisMonth,
    percentageIncrease,
  };
}