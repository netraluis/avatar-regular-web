import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const addTokenLedgerMovement = async ({
  teamId,
  tokenAdds,
  paddleSubscriptionId,
  runId,
}: {
  teamId: string;
  tokenAdds: number;
  paddleSubscriptionId?: string;
  runId?: string;
}) => {
  try {
    const lastInsertedTokenLedger = await prisma.tokenLedger.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        teamId,
      },
      select: {
        totalToken: true,
      },
    });

    const totalToken = lastInsertedTokenLedger?.totalToken || 0;

    const data: Prisma.TokenLedgerCreateInput = {
      team: {
        connect: {
          id: teamId,
        },
      },
      totalToken: totalToken + tokenAdds,
      tokenCost: tokenAdds,
      paddleSubscriptionId: paddleSubscriptionId,
      runId: runId,
    };

    await prisma.tokenLedger.create({
      data,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error adding token ledger movement");
  }
};

export const changeTokenLedgerMovementSubscription = async ({
  teamId,
  tokenAdds,
  paddleSubscriptionId,
  runId,
}: {
  teamId: string;
  tokenAdds: number;
  paddleSubscriptionId?: string;
  runId?: string;
}) => {
  try {
    const lastInsertedTokenLedgerbySub = await prisma.tokenLedger.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        teamId,
        paddleSubscriptionId,
      },
      select: {
        tokenCost: true,
      },
    });

    const tokenCostOldSub = lastInsertedTokenLedgerbySub?.tokenCost || 0;

    const lastInsertedTokenLedger = await prisma.tokenLedger.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        teamId,
      },
      select: {
        totalToken: true,
      },
    });

    const totalTokenNewToken = lastInsertedTokenLedger?.totalToken || 0;

    const dataNewSub: Prisma.TokenLedgerCreateInput = {
      team: {
        connect: {
          id: teamId,
        },
      },
      totalToken: totalTokenNewToken + tokenAdds - tokenCostOldSub,
      tokenCost: tokenAdds,
      paddleSubscriptionId: paddleSubscriptionId,
      runId: runId,
    };

    await prisma.tokenLedger.create({
      data: dataNewSub,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error changing token ledger movement subscription");
  }
};
