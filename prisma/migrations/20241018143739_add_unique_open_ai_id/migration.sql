/*
  Warnings:

  - A unique constraint covering the columns `[openAIId]` on the table `Assistant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `openAIId` on table `Assistant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Assistant" ALTER COLUMN "openAIId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_openAIId_key" ON "Assistant"("openAIId");
