/*
  Warnings:

  - You are about to drop the column `productId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `SubscriptionCycle` table. All the data in the column will be lost.
  - Added the required column `priceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `SubscriptionCycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "productId",
ADD COLUMN     "priceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionCycle" DROP COLUMN "productId",
ADD COLUMN     "priceId" TEXT NOT NULL;
