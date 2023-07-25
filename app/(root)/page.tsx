import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

import prisma from "@/app/libs/prismadb";
import { Appointment, Day, Patient } from "@prisma/client";
import { addMonths, startOfMonth, subMonths } from "date-fns";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

async function getNewPatientsData() {
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

export default async function DashboardPage() {
  const { newPatientsThisMonth, percentageIncrease } =
    await getNewPatientsData();

  const appointments: Appointment[] = await prisma.appointment.findMany({
    include: {
      time: true,
      day: true,
      patient: true,
    },
  });

  const days: Day[] = await prisma.day.findMany({
    include: {
      _count: true,
      appointments: true,
    },
  });

  const patients: Patient[] = await prisma.patient.findMany({
    include: {
      _count: true,
      appointments: true,
      healthInsurance: true,
    },
  });

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect("/auth");
  }

  if (!currentUser?.admin) return redirect("/needs-admin");
  return (
    <>
      <div className="flex-col overflow-x-hidden md:flex">
        <div className="flex-1 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 py-5 lg:flex-row">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs
            defaultValue="overview"
            className="flex flex-col items-center gap-6"
          >
            <TabsList className="hidden md:block">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" disabled>
                  Reports
                </TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total recaudado
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${patients.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% desde el ultimo mes
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Nuevos pacientes
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{newPatientsThisMonth}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {percentageIncrease.toFixed(1)}% desde el último mes
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Turnos
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {appointments.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +19% desde el ultimo mes
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-7 lg:gap-4">
                <Card className="w-full lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Turnos en la semana</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <Overview days={days} appointments={appointments} />
                  </CardContent>
                </Card>
                <Card className="w-full lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Turnos recientes</CardTitle>
                    <CardDescription>
                      Tuvo 20 en turnos esta semana
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full">
                    <RecentSales
                      patients={patients}
                      appointments={appointments}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
