import { createApointment, getApointment, getAppointments } from "@/utils/controllers/appointment";
import { createDay, getDay, getDays } from "@/utils/controllers/day";
import { createPatient, getPatient, getPatients } from "@/utils/controllers/patient";
import { createStartTime, getStartTime, getStartTimes } from "@/utils/controllers/startTime";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({

  //appointments
  getAppointments: t.procedure.query(async () => {
    return await getAppointments()
  }),
  getApointment: t.procedure.input(z.object({
    appointmentId: z.number(),
  })).query(async ({
    input: { appointmentId }
  }) => {
    if (!appointmentId) return null;
    return await getApointment(appointmentId)
  }),
  createApointment: t.procedure.input(z.object({
    patientId: z.number(),
    startTimeId: z.number(),
    endTimeId: z.number(),
    dayId: z.number(),
  })).mutation(async ({
    input: { patientId, startTimeId, endTimeId, dayId }
  }) => {
    return await createApointment(
      patientId,
      startTimeId,
      endTimeId,
      dayId,

    )
  }),

  //patients
  getPatients: t.procedure.query(async () => {
    return await getPatients()
  }),
  getPatient: t.procedure.input(z.object({
    patientId: z.number(),
  })).query(async ({
    input: { patientId }
  }) => {
    return await getPatient(patientId)
  }),
  createPatient: t.procedure.input(z.object({
    fullName: z.string(),
    email: z.string().email(),
  })).mutation(async ({ input: { email, fullName } }) => {
    return await createPatient(fullName, email)
  }),

  //days
  getDays: t.procedure.query(async () => {
    return await getDays()
  }),
  getDay: t.procedure.input(z.object({
    dayId: z.number(),
  })).query(async ({
    input: { dayId }
  }) => {
    if (!dayId) return null;
    return await getDay(dayId)
  }),
  createDay: t.procedure.input(z.object({
    weekday: z.string().min(3),
  })).mutation(async ({
    input: { weekday }
  }) => {
    return await createDay(
      weekday
    )
  }),

  //startTime
  getStartTimes: t.procedure.query(async () => {
    return await getStartTimes()
  }),
  getStartTime: t.procedure.input(z.object({
    startTimeId: z.number(),
  })).query(async ({
    input: { startTimeId }
  }) => {
    if (!startTimeId) return null;
    return await getStartTime(startTimeId)
  }),
  createStartTime: t.procedure.input(z.object({
    startTime: z.string().min(3),
  })).mutation(async ({
    input: { startTime }
  }) => {
    return await createStartTime(
      startTime
    )
  }),
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

