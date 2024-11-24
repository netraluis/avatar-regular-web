/*
  Warnings:

  - You are about to drop the column `type` on the `Footer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `MenuFooter` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Welcome` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Footer" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "MenuFooter" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "welcomeType" "WelcomeType";

-- AlterTable
ALTER TABLE "Welcome" DROP COLUMN "type";

-- DropEnum
DROP TYPE "FooterType";

-- DropEnum
DROP TYPE "MenuFooterType";
