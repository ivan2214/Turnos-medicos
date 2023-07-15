import { User } from "@prisma/client";

export interface Turnos {
  nombre: string
  horaInicio: String
  horaFin: String
  tomado: Boolean
  fecha: Date
}

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
