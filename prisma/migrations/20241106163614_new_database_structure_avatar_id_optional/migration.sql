/*
  Warnings:

  - You are about to drop the column `openAiFileId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[openAIFileId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `openAIFileId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_openAiFileId_key";

-- AlterTable
ALTER TABLE "Assistant" ALTER COLUMN "openAIId" DROP NOT NULL,
ALTER COLUMN "openAIVectorStoreFileId" DROP NOT NULL,
ALTER COLUMN "avatarId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "openAiFileId",
ADD COLUMN     "openAIFileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_openAIFileId_key" ON "File"("openAIFileId");
