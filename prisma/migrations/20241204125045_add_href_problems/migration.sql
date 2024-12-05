/*
  Warnings:

  - You are about to drop the column `href` on the `TextHref` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `TextHref` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `TextHref` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TextHref" DROP COLUMN "href",
DROP COLUMN "language",
DROP COLUMN "text";
