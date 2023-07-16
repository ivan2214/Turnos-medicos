import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

type TypeCreateUser = {
  email: string
  name: string,
  password: string
}

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      appointments: true,
    },
  });
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};




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
      admin: email === "bongiovanniivan12@gmail.com" ? true : false
    }
  });

  return user
};
