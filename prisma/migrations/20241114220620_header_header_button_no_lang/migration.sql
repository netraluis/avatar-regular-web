/*
  Warnings:

  - You are about to drop the column `language` on the `HeaderButton` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `MenuHeader` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,teamId]` on the table `MenuHeader` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MenuHeader_type_language_teamId_key";

-- AlterTable
ALTER TABLE "HeaderButton" DROP COLUMN "language";

-- AlterTable
ALTER TABLE "MenuHeader" DROP COLUMN "language";

-- CreateIndex
CREATE UNIQUE INDEX "MenuHeader_type_teamId_key" ON "MenuHeader"("type", "teamId");
