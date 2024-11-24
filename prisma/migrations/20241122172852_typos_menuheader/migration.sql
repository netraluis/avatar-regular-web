/*
  Warnings:

  - You are about to drop the column `buttonType` on the `HeaderButton` table. All the data in the column will be lost.
  - Added the required column `type` to the `HeaderButton` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HeaderButtonType" AS ENUM ('PLAIN');

-- AlterTable
ALTER TABLE "HeaderButton" DROP COLUMN "buttonType",
ADD COLUMN     "type" "HeaderButtonType" NOT NULL;

-- DropEnum
DROP TYPE "headerButtonType";
