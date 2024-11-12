/*
  Warnings:

  - You are about to drop the column `usageTotalTokens` on the `Message` table. All the data in the column will be lost.
  - Added the required column `runId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "usageTotalTokens",
ADD COLUMN     "runId" TEXT NOT NULL;
