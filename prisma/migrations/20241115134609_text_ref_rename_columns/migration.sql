/*
  Warnings:

  - You are about to drop the column `originalTextHrefId` on the `TextHref` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TextHref" DROP CONSTRAINT "TextHref_originalTextHrefId_fkey";

-- AlterTable
ALTER TABLE "TextHref" DROP COLUMN "originalTextHrefId",
ADD COLUMN     "defaultTextHrefId" TEXT;

-- AddForeignKey
ALTER TABLE "TextHref" ADD CONSTRAINT "TextHref_defaultTextHrefId_fkey" FOREIGN KEY ("defaultTextHrefId") REFERENCES "TextHref"("id") ON DELETE CASCADE ON UPDATE CASCADE;
