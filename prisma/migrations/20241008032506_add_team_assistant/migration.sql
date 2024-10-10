/*
  Warnings:

  - A unique constraint covering the columns `[name,teamId]` on the table `Assistant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AsssitantStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "status" "AsssitantStatus" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "subDomain" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_name_teamId_key" ON "Assistant"("name", "teamId");
