import prisma from "../prisma";
import { Prisma, Subscription } from "@prisma/client";

export const createSubscription = async (
  data: Prisma.SubscriptionCreateInput,
): Promise<Subscription> => {
  const subscription = await prisma.subscription.create({
    data,
  });

  return subscription;
};

export const getSubscription = async (
  where: Prisma.SubscriptionWhereUniqueInput,
): Promise<Subscription> => {
  const subscription = await prisma.subscription.findUnique({
    where,
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  return subscription;
};

export const updateSubscription = async (
  where: Prisma.SubscriptionWhereUniqueInput,
  data: Prisma.SubscriptionUpdateInput,
): Promise<Subscription> => {
  const subscription = await prisma.subscription.update({
    where,
    data,
  });

  return subscription;
};

export const createSubscriptionCycle = async (
  data: Prisma.SubscriptionCycleCreateManyInput[],
) => {
  const subscriptionCycle = await prisma.subscriptionCycle.createMany({
    data,
  });

  return subscriptionCycle;
};

export const getSubscriptionCyle = async (subscriptionId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id: subscriptionId,
    },
  });

  const cycleSubscription = await prisma.subscriptionCycle.findFirst({
    where: {
      subscriptionId,
      startOfCycle: {
        lte: new Date(),
      },
      endOfCycle: {
        gte: new Date(),
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  console.log({ cycleSubscription });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  return cycleSubscription;
};
