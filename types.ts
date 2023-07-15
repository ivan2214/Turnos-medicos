import { Appointment, Day, User } from "@prisma/client";

export type SafeAppointment = Omit<
  Appointment,
  "createdAt"
> & {
  createdAt: string;

};

export type SafeDay = Omit<
  Day,
  "createdAt"
> & {
  createdAt: string;
};


export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
