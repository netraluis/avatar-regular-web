/*
  Warnings:

  - Made the column `type` on table `UserTeam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserTeam" ALTER COLUMN "type" SET NOT NULL;
