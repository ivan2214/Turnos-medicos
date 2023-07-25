import { createAppointment, deleteAppointment, getApointment, getAppointments } from "@/utils/controllers/appointment";
import { createDay, deleteDay, getDay, getDays } from "@/utils/controllers/day";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "@/utils/controllers/user";
import { createTime, deleteTime, getTime, getTimes } from "@/utils/controllers/time";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { createPatient, deletePatient, getPatient, getPatients } from "@/utils/controllers/patient";
import { Context } from "vm";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const readOnlyMiddleware = middleware(async ({ type, next }) => {
  if (type === 'mutation') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No se permite escribir datos',
    });
  }
  return next();
});

export const privateProcedure = publicProcedure.use(readOnlyMiddleware);

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
  deleteAppointmentInteral: privateProcedure.input(z.object({
    appointmentId: z.string().uuid().min(1),
  })).mutation(async ({
    input: { appointmentId }
  }) => {
    return await deleteAppointment(
      appointmentId
    )
  }),
  createAppointmentInternal: privateProcedure.input(z.object({
    appointmentId: z.string().uuid().min(1).optional(),
    patientId: z.string().uuid().min(1),
    dayId: z.string().uuid().min(1),
    busy: z.boolean().optional().default(true),
    time: z.object({
      timeId: z.string().uuid().min(1),
      startTime: z.string().min(1),
      endTime: z.string().min(1),
    })
  })).mutation(async ({
    input: { appointmentId, patientId, dayId, time, busy }
  }) => {
    return await createAppointment(
      patientId,
      dayId,
      busy,
      time,
      appointmentId
    )
  }),

  //days
  getDays: t.procedure.query(async () => {
    return await getDays()
  }),
  getDay: t.procedure.input(z.object({
    dayId: z.string().uuid().min(1),
  })).query(async ({
    input: { dayId }
  }) => {
    if (!dayId) return null;
    return await getDay(dayId)
  }),
  deleteDayInternal: privateProcedure.input(z.object({
    dayId: z.string().uuid().min(1),
  })).mutation(async ({
    input: { dayId }
  }) => {
    return await deleteDay(
      dayId
    )
  }),
  createDay: privateProcedure.input(z.object({
    weekday: z.string().min(3),
  })).mutation(async ({
    input: { weekday }
  }) => {
    return await createDay(
      weekday
    )
  }),

  //times
  getTimes: t.procedure.query(async () => {
    return await getTimes()
  }),
  getTime: t.procedure.input(z.object({
    startTimeId: z.string().min(1),
  })).query(async ({
    input: { startTimeId }
  }) => {
    if (!startTimeId) return null;
    return await getTime(startTimeId)
  }),
  createTime: privateProcedure.input(z.object({
    time: z.object({
      startTime: z.string().min(1),
      endTime: z.string().min(1),
    }),
    dayId: z.string().uuid().min(1),
    timeId: z.string().uuid().min(1).optional(),
  })).mutation(async ({
    input: { time, dayId, timeId }
  }) => {
    return await createTime(
      time, dayId, timeId
    )
  }),
  deleteTime: privateProcedure.input(z.object({
    timeId: z.string().uuid().min(1),
  })).mutation(async ({
    input: { timeId }
  }) => {
    return await deleteTime(
      timeId
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
  deleteUserInternal: privateProcedure.input(z.object({
    userId: z.string().uuid().min(1),
  })).mutation(async ({
    input: { userId }
  }) => {
    return await deleteUser(
      userId
    )
  }),
  createUserInternal: privateProcedure.input(z.object({
    email: z.string().min(3),
    name: z.string().min(3),
    admin: z.boolean().default(false).optional(),
    password: z.string().min(3),
  })).mutation(async ({
    input: { email, name, admin, password }
  }) => {
    return await createUser(
      {
        email,
        name,
        admin,
        password,
      }
    )
  }),
  updateUserInternal: privateProcedure.input(z.object({
    email: z.string().min(3),
    name: z.string().min(3),
    admin: z.boolean().default(false).optional(),
    userId: z.string().uuid().min(1),
    password: z.string().min(3).optional(),
  })).mutation(async ({
    input: { email, name, admin, userId, password }
  }) => {
    return await updateUser(
      {
        email,
        name,
        admin,
        userId,
        password
      }
    )
  }),

  //Patients
  getPatients: t.procedure.query(async () => {
    return await getPatients()
  }),
  getPatient: t.procedure.input(z.object({
    patientId: z.string().uuid(),
  })).query(async ({
    input: { patientId }
  }) => {
    return await getPatient(patientId)
  }),
  deletePatientInternal: privateProcedure.input(z.object({
    patientId: z.string().uuid().min(1),
  })).mutation(async ({
    input: { patientId }
  }) => {
    return await deletePatient(
      patientId
    )
  }),
  createPatientInternal: privateProcedure.input(z.object({
    email: z.string().min(3),
    name: z.string().min(3),
    healthInsuranceId: z.string().uuid().optional(),
  })).mutation(async ({
    input: { email, name, healthInsuranceId }
  }) => {
    return await createPatient(
      {
        email,
        name,
        healthInsuranceId
      }
    )
  }),
});



export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

