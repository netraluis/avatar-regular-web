/*
  Warnings:

  - You are about to drop the column `openAIVectorStoreId` on the `Assistant` table. All the data in the column will be lost.
  - Added the required column `openAIVectorStoreFileId` to the `Assistant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openAIVectorStoreNotionId` to the `Assistant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "openAIVectorStoreId",
ADD COLUMN     "openAIVectorStoreFileId" TEXT NOT NULL,
ADD COLUMN     "openAIVectorStoreNotionId" TEXT NOT NULL;
