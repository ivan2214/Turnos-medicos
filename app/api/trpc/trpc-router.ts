import { createApointment, getApointment, getAppointments } from "@/utils/controllers/appointment";
import { createDay, getDay, getDays } from "@/utils/controllers/day";
import { createUser, getUser, getUsers } from "@/utils/controllers/user";
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
    appointmentId: z.string().min(1),
  })).query(async ({
    input: { appointmentId }
  }) => {
    if (!appointmentId) return null;
    return await getApointment(appointmentId)
  }),
  createApointment: t.procedure.input(z.object({
    userId: z.string().uuid(),
    startTimeId: z.string().min(1),
    endTimeId: z.string().min(1),
    dayId: z.string().min(1),
  })).mutation(async ({
    input: { userId, startTimeId, endTimeId, dayId }
  }) => {
    return await createApointment(
      userId,
      startTimeId,
      endTimeId,
      dayId,

    )
  }),

  //days
  getDays: t.procedure.query(async () => {
    return await getDays()
  }),
  getDay: t.procedure.input(z.object({
    dayId: z.string().min(1),
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
    startTimeId: z.string().min(1),
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

  //users
  getUsers: t.procedure.query(async () => {
    return await getUsers()
  }),
  getUser: t.procedure.input(z.object({
    userId: z.string().uuid(),
  })).query(async ({
    input: { userId }
  }) => {
    return await getUser(userId)
  }),
  createUser: t.procedure.input(z.object({
    email: z.string().min(3),
    name: z.string().min(3),
    password: z.string().min(3),
  })).mutation(async ({
    input: { email, name, password }
  }) => {
    return await createUser(
      {
        email,
        name,
        password
      }
    )
  }),
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

