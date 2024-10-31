/*
  Warnings:

  - Added the required column `openAIVectorStoreId` to the `Assistant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "openAIVectorStoreId" TEXT NOT NULL;
