/*
  Warnings:

  - Added the required column `language` to the `HeaderButton` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeaderButton" ADD COLUMN     "language" "LanguageType" NOT NULL;
