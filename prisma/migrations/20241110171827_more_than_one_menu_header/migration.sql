/*
  Warnings:

  - A unique constraint covering the columns `[type,language,teamId]` on the table `MenuHeader` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MenuHeader_teamId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MenuHeader_type_language_teamId_key" ON "MenuHeader"("type", "language", "teamId");
