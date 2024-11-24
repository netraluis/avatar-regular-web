/*
  Warnings:

  - Added the required column `headerButton` to the `HeaderButton` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeaderButton" ADD COLUMN     "headerButton" "HeaderButtonType" NOT NULL;
