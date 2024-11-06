/*
  Warnings:

  - Made the column `openAIId` on table `Assistant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openAIVectorStoreFileId` on table `Assistant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Assistant" ALTER COLUMN "openAIId" SET NOT NULL,
ALTER COLUMN "openAIVectorStoreFileId" SET NOT NULL;
