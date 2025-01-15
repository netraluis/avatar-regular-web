-- CreateTable
CREATE TABLE "TokenLedger" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "runId" TEXT,
    "paddleSubscriptionId" TEXT,
    "tokenCost" INTEGER NOT NULL,
    "totalToken" INTEGER NOT NULL,

    CONSTRAINT "TokenLedger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenLedger" ADD CONSTRAINT "TokenLedger_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
