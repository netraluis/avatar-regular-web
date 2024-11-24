/*
  Warnings:

  - You are about to drop the column `headerButton` on the `HeaderButton` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `HeaderButton` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HeaderButton" DROP COLUMN "headerButton",
DROP COLUMN "type";
