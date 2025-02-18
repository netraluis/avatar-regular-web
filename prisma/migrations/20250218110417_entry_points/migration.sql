/*
  Warnings:

  - You are about to drop the column `teamId` on the `EntryPoints` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assistantId]` on the table `EntryPoints` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assistantId` to the `EntryPoints` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EntryPoints" DROP CONSTRAINT "EntryPoints_teamId_fkey";

-- DropIndex
DROP INDEX "EntryPoints_teamId_key";

-- AlterTable
ALTER TABLE "EntryPoints" DROP COLUMN "teamId",
ADD COLUMN     "assistantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EntryPoints_assistantId_key" ON "EntryPoints"("assistantId");

-- AddForeignKey
ALTER TABLE "EntryPoints" ADD CONSTRAINT "EntryPoints_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
