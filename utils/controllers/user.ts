import bcrypt from "bcrypt"
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";


export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      accounts: true
    },
  });
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include:
    {
      accounts: true
    }
  });
};
export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};


type TypeCreateUser = {
  email: string
  name: string,
  admin?: boolean
  password: string
}

export const createUser = async ({
  email,
  name,
  admin,
  password,
}: TypeCreateUser) => {
  const userAlreadyExistins = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExistins) {
    throw new Error(`User ${name} already exists.`)
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      admin: admin ?? false
    }
  });

  return user
};


type TypeUpdateUser = {
  email: string
  name: string
  admin?: boolean
  userId: string
  password?: string | undefined
}

export const updateUser = async ({
  email,
  name,
  admin,
  userId,
  password
}: TypeUpdateUser) => {

  let user: User

  if (password && password !== "" && password !== undefined) {

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email,
        name,
        hashedPassword,
        admin: admin ?? false
      }
    });
    return user
  }
  else {
    user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email,
        name,
        admin: admin ?? false
      }
    });
    return user
  }

};
