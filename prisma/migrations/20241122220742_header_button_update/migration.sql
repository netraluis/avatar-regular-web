/*
  Warnings:

  - You are about to drop the column `headerButton` on the `HeaderButton` table. All the data in the column will be lost.
  - Added the required column `type` to the `HeaderButton` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeaderButton" DROP COLUMN "headerButton",
ADD COLUMN     "type" "HeaderButtonType" NOT NULL;
