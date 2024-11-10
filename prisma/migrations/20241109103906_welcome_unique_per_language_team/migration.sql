/*
  Warnings:

  - You are about to drop the column `domainId` on the `Welcome` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[language,teamId]` on the table `Welcome` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Welcome_teamId_key";

-- AlterTable
ALTER TABLE "Welcome" DROP COLUMN "domainId";

-- CreateIndex
CREATE UNIQUE INDEX "Welcome_language_teamId_key" ON "Welcome"("language", "teamId");
