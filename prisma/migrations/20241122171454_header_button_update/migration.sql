/*
  Warnings:

  - You are about to drop the column `headerButtonId` on the `TextHref` table. All the data in the column will be lost.
  - Added the required column `headerButton` to the `HeaderButton` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `buttonType` on the `HeaderButton` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "headerButtonType" AS ENUM ('PLAIN');

-- DropForeignKey
ALTER TABLE "TextHref" DROP CONSTRAINT "TextHref_headerButtonId_fkey";

-- AlterTable
ALTER TABLE "HeaderButton" ADD COLUMN     "headerButton" TEXT NOT NULL,
ADD COLUMN     "text" TEXT[],
DROP COLUMN "buttonType",
ADD COLUMN     "buttonType" "headerButtonType" NOT NULL;

-- AlterTable
ALTER TABLE "TextHref" DROP COLUMN "headerButtonId";
