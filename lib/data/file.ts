import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const getFiles = async (data: Prisma.FileWhereInput) => {
  return await prisma.file.findMany({
    where: data,
  });
};

export const createFile = async (data: Prisma.FileCreateInput) => {
  return await prisma.file.create({
    data,
  });
};

export const deleteFile = async (data: Prisma.FileWhereUniqueInput) => {
  return await prisma.file.delete({
    where: data,
  });
};
