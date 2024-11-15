/*
  Warnings:

  - A unique constraint covering the columns `[numberOrder,language,menuHeaderId]` on the table `TextHref` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numberOrder,language,headerButtonId]` on the table `TextHref` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `TextHref` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TextHref" ADD COLUMN     "language" "LanguageType" NOT NULL,
ADD COLUMN     "originalTextHrefId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TextHref_numberOrder_language_menuHeaderId_key" ON "TextHref"("numberOrder", "language", "menuHeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "TextHref_numberOrder_language_headerButtonId_key" ON "TextHref"("numberOrder", "language", "headerButtonId");

-- AddForeignKey
ALTER TABLE "TextHref" ADD CONSTRAINT "TextHref_originalTextHrefId_fkey" FOREIGN KEY ("originalTextHrefId") REFERENCES "TextHref"("id") ON DELETE CASCADE ON UPDATE CASCADE;
