import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

type TypeCreateUser = {
  email: string
  name: string,
  password: string
}

export const createUser = async ({
  email,
  name,
  password
}: TypeCreateUser) => {
  const userAlreadyExistins = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExistins) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      admin: false
    }
  });

  return user
};
