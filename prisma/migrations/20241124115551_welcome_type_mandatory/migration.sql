/*
  Warnings:

  - Made the column `welcomeType` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "welcomeType" SET NOT NULL;
