import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";


import { Context } from "vm";


import { getDays, getAppointments, getApointment, deleteAppointment, createAppointment, deleteDay, createDay, getTimes, createTime, deleteTime, getUsers, getUser, deleteUser, createUser, updateUser, getPatients, getPatient, deletePatient, createPatient, getDay, getTime } from "@/utils/controllers";

import { z } from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

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

// Procedimientos relacionados con appointments
const appointmentProcedures = {
  getAppointments: publicProcedure.query(async () => {
    return await getAppointments();
  }),
  getApointment: publicProcedure
    .input(z.object({
      appointmentId: z.string().min(1),
    }))
    .query(async ({ input: { appointmentId } }) => {
      if (!appointmentId) return null;
      return await getApointment(appointmentId);
    }),
  deleteAppointmentInternal: publicProcedure
    .input(z.object({
      appointmentId: z.string().uuid().min(1),
    }))
    .mutation(async ({ input: { appointmentId } }) => {
      return await deleteAppointment(appointmentId);
    }),
  createAppointmentInternal: publicProcedure
    .input(z.object({
      appointmentId: z.string().uuid().min(1).optional(),
      patientId: z.string().uuid().min(1),
      dayId: z.string().uuid().min(1),
      busy: z.boolean().optional().default(true),
      time: z.object({
        timeId: z.string().uuid().min(1),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
      }),
    }))
    .mutation(async ({ input: { appointmentId, patientId, dayId, time, busy } }) => {
      return await createAppointment(patientId, dayId, busy, time, appointmentId);
    }),
  // ... Agrega otros procedimientos relacionados con appointments aquí
};

// Procedimientos relacionados con days
const dayProcedures = {
  getDays: publicProcedure.query(async () => {
    return await getDays();
  }),
  getDay: publicProcedure
    .input(z.object({
      dayId: z.string().uuid().min(1),
    }))
    .query(async ({ input: { dayId } }) => {
      if (!dayId) return null;
      return await getDay(dayId);
    }),
  deleteDayInternal: publicProcedure
    .input(z.object({
      dayId: z.string().uuid().min(1),
    }))
    .mutation(async ({ input: { dayId } }) => {
      return await deleteDay(dayId);
    }),
  createDay: publicProcedure
    .input(z.object({
      weekday: z.string().min(3),
    }))
    .mutation(async ({ input: { weekday } }) => {
      return await createDay(weekday);
    }),
  // ... Agrega otros procedimientos relacionados con days aquí
};

// Procedimientos relacionados con times
const timeProcedures = {
  getTimes: publicProcedure.query(async () => {
    return await getTimes();
  }),
  getTime: publicProcedure
    .input(z.object({
      startTimeId: z.string().min(1),
    }))
    .query(async ({ input: { startTimeId } }) => {
      if (!startTimeId) return null;
      return await getTime(startTimeId);
    }),
  createTime: publicProcedure
    .input(z.object({
      time: z.object({
        startTime: z.string().min(1),
        endTime: z.string().min(1),
      }),
      dayId: z.string().uuid().min(1),
      timeId: z.string().uuid().min(1).optional(),
    }))
    .mutation(async ({ input: { time, dayId, timeId } }) => {
      return await createTime(time, dayId, timeId);
    }),
  deleteTime: publicProcedure
    .input(z.object({
      timeId: z.string().uuid().min(1),
    }))
    .mutation(async ({ input: { timeId } }) => {
      return await deleteTime(timeId);
    }),
  // ... Agrega otros procedimientos relacionados con times aquí
};

// Procedimientos relacionados con users
const userProcedures = {
  getUsers: publicProcedure.query(async () => {
    return await getUsers();
  }),
  getUser: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .query(async ({ input: { userId } }) => {
      return await getUser(userId);
    }),
  deleteUserInternal: publicProcedure
    .input(z.object({
      userId: z.string().uuid().min(1),
    }))
    .mutation(async ({ input: { userId } }) => {
      return await deleteUser(userId);
    }),
  createUserInternal: publicProcedure
    .input(z.object({
      email: z.string().min(3),
      name: z.string().min(3),
      admin: z.boolean().default(false).optional(),
      password: z.string().min(3),
    }))
    .mutation(async ({ input: { email, name, admin, password } }) => {
      return await createUser({
        email,
        name,
        admin,
        password,
      });
    }),
  updateUserInternal: publicProcedure
    .input(z.object({
      email: z.string().min(3),
      name: z.string().min(3),
      admin: z.boolean().default(false).optional(),
      userId: z.string().uuid().min(1),
      password: z.string().min(3).optional(),
    }))
    .mutation(async ({ input: { email, name, admin, userId, password } }) => {
      return await updateUser({
        email,
        name,
        admin,
        userId,
        password,
      });
    }),
  // ... Agrega otros procedimientos relacionados con users aquí
};

// Procedimientos relacionados con patients
const patientProcedures = {
  getPatients: publicProcedure.query(async () => {
    return await getPatients();
  }),
  getPatient: publicProcedure
    .input(z.object({
      patientId: z.string().uuid(),
    }))
    .query(async ({ input: { patientId } }) => {
      return await getPatient(patientId);
    }),
  deletePatientInternal: publicProcedure
    .input(z.object({
      patientId: z.string().uuid().min(1),
    }))
    .mutation(async ({ input: { patientId } }) => {
      return await deletePatient(patientId);
    }),
  createPatientInternal: publicProcedure
    .input(z.object({
      email: z.string().min(3),
      name: z.string().min(3),
      healthInsuranceId: z.string().uuid().optional(),
    }))
    .mutation(async ({ input: { email, name, healthInsuranceId } }) => {
      return await createPatient({
        email,
        name,
        healthInsuranceId,
      });
    }),
  // ... Agrega otros procedimientos relacionados con patients aquí
};


export const appRouter = t.router({
  ...appointmentProcedures,
  ...dayProcedures,
  ...timeProcedures,
  ...userProcedures,
  ...patientProcedures,
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple

