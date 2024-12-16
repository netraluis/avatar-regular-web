import prisma from "../prisma";
import { Prisma, UserStatus } from "@prisma/client";

export const getUserById = async (userId: string) => {
  const subdomainInfo = await prisma.user.findMany({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  return subdomainInfo;
};

export const updateUser = async ({
  teamId,
  data,
}: {
  teamId: string;
  data: Prisma.UserUpdateInput;
}) => {
  try {
    const updateData = await prisma.user.update({
      where: {
        id: teamId,
      },
      data,
    });

    return { success: true, data: updateData };
  } catch (error: any) {
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "An unexpected error occurred.",
    };
  } finally {
    await prisma.$disconnect();
  }
};
