/*
  Warnings:

  - You are about to drop the column `startBiilingData` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `startBillingData` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "startBiilingData",
ADD COLUMN     "startBillingData" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "scheduleChange" DROP NOT NULL;
