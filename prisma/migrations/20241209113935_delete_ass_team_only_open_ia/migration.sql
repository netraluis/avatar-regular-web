/*
  Warnings:

  - You are about to drop the `Domains` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Domains";
