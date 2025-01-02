/*
  Warnings:

  - A unique constraint covering the columns `[url,teamId]` on the table `Assistant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assistant_name_teamId_key";

-- DropIndex
DROP INDEX "Assistant_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_url_teamId_key" ON "Assistant"("url", "teamId");
