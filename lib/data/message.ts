import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const createMessage = async (message: Prisma.MessageCreateInput) => {
  return prisma.message.create({
    data: message,
  });
};
