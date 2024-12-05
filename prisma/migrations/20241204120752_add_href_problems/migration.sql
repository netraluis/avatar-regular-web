/*
  Warnings:

  - A unique constraint covering the columns `[defaultTextHrefId,language]` on the table `TextHref` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TextHref" DROP CONSTRAINT "TextHref_defaultTextHrefId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "TextHref_defaultTextHrefId_language_key" ON "TextHref"("defaultTextHrefId", "language");

-- AddForeignKey
ALTER TABLE "TextHref" ADD CONSTRAINT "TextHref_defaultTextHrefId_fkey" FOREIGN KEY ("defaultTextHrefId") REFERENCES "TextHref"("id") ON DELETE SET NULL ON UPDATE CASCADE;
