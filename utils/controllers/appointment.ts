import prisma from "@/app/libs/prismadb";
import { Appointment, Day, Patient, Time } from "@prisma/client";


export const getAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      day: {
        weekday: "asc"
      }
    },
  });

  if (!appointments) throw new Error("No appointments found");

  return appointments
};

export const getApointment = async (appointmentId: string) => {
  if (!appointmentId) return null;


  const appointment = prisma.appointment.findMany({
    where: {
      id: appointmentId,
    },
    orderBy: {
      day: {
        weekday: "asc"
      }
    },
  });

  if (!appointment) throw new Error("No appointment found");

  return appointment
};


type TimeProp = {
  timeId: string
  startTime: string
  endTime: string
}

export const deleteAppointment = async (appointmentId: string) => {

  if (!appointmentId) throw new Error("No appointment found");

  return prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });
};


export const createAppointment = async (
  patientId: string,
  dayId: string,
  busy: boolean,
  timeProp: TimeProp,
  appointmentId?: string,
) => {
  if (!isValidFormData(patientId, dayId, timeProp)) {
    throw new Error("Datos no válidos");
  }

  const day = await findDay(dayId);
  const patient = await findPatient(patientId);
  const time = await findTime(timeProp.timeId);

  if (!patient) {
    throw new Error("El paciente no fue encontrado");
  }

  if (!day) {
    throw new Error("El día no fue encontrado");
  }

  if (!time) {
    throw new Error("El tiempo no fue encontrado");
  }

  const existingAppointment = await findAppointmentByDayAndTime(dayId, timeProp.timeId);
  if (existingAppointment) {
    throw new Error("Ya existe un turno en el mismo día y horario");
  }

  if (appointmentId) {
    const appointment = await findAppointment(appointmentId);
    if (appointment && time) {
      const isTimeOccupied = await isTimeOccupiedByOtherAppointment(appointmentId, dayId, timeProp.timeId);
      if (isTimeOccupied) {
        throw new Error("El horario ya está ocupado por otro turno");
      }
      return await updateAppointment(appointment, busy, patient, day, time);
    }
  }

  return await createNewAppointment(day, busy, patient, timeProp.timeId);
};

const isValidFormData = (
  patientId: string,
  dayId: string,
  timeProp: TimeProp
) => {
  return (
    patientId !== "" &&
    dayId !== "" &&
    timeProp.timeId !== "" &&
    timeProp.startTime !== "" &&
    timeProp.endTime !== ""
  );
};

const findDay = async (dayId: string) => {
  return await prisma.day.findUnique({
    where: {
      id: dayId,
    },
  });
};

const findPatient = async (patientId: string) => {
  return await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });
};

const findAppointment = async (appointmentId: string) => {
  return await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
  });
};

const findTime = async (timeId: string) => {
  return await prisma.time.findUnique({
    where: {
      id: timeId,
    },
  });
};

const findAppointmentByDayAndTime = async (dayId: string, timeId: string) => {
  return await prisma.appointment.findFirst({
    where: {
      dayId: dayId,
      timeId: timeId,
    },
  });
};

const isTimeOccupiedByOtherAppointment = async (appointmentId: string, dayId: string, timeId: string) => {
  return await prisma.appointment.findFirst({
    where: {
      id: { not: appointmentId },
      dayId: dayId,
      timeId: timeId,
    },
  });
};

const updateAppointment = async (
  appointment: Appointment,
  busy: boolean,
  patient: Patient,
  day: Day,
  time: Time
) => {
  return await prisma.appointment.update({
    where: {
      id: appointment.id,
    },
    data: {
      busy: busy,
      patientId: patient.id,
      dayId: day.id,
      timeId: time.id,
    },
  });
};

const createNewAppointment = async (
  day: Day,
  busy: boolean,
  patient: Patient,
  timeId: string
) => {
  return await prisma.appointment.create({
    data: {
      dayId: day.id,
      busy: busy,
      patientId: patient.id,
      timeId: timeId,
    },
  });
};

