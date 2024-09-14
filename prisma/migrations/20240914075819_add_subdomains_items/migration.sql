/*
  Warnings:

  - Added the required column `assistantName` to the `Domains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuBody` to the `Domains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuHeader` to the `Domains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menufooter` to the `Domains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domains" ADD COLUMN     "assistantName" TEXT NOT NULL,
ADD COLUMN     "menuBody" JSONB NOT NULL,
ADD COLUMN     "menuHeader" JSONB NOT NULL,
ADD COLUMN     "menufooter" TEXT NOT NULL;
