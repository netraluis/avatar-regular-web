/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Assistant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Assistant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_url_key" ON "Assistant"("url");

-- RenameIndex
ALTER INDEX "Team_subDomain_key" RENAME TO "Unique_SubDomain_Field";
