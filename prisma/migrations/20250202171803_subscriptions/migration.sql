/*
  Warnings:

  - You are about to drop the `TokenLedger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TokenLedger" DROP CONSTRAINT "TokenLedger_teamId_fkey";

-- AlterTable
ALTER TABLE "Assistant" ALTER COLUMN "status" SET DEFAULT 'PRIVATE';

-- DropTable
DROP TABLE "TokenLedger";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "scheduleChange" TIMESTAMP(3) NOT NULL,
    "endBillingData" TIMESTAMP(3) NOT NULL,
    "startBiilingData" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionCycle" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "startOfCycle" TIMESTAMP(3) NOT NULL,
    "endOfCycle" TIMESTAMP(3) NOT NULL,
    "maxCredits" INTEGER NOT NULL,
    "extraCredits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_teamId_key" ON "Subscription"("teamId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionCycle" ADD CONSTRAINT "SubscriptionCycle_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
