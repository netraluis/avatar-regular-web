/*
  Warnings:

  - You are about to drop the column `domain` on the `Domains` table. All the data in the column will be lost.
  - Added the required column `subDomain` to the `Domains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domains" DROP COLUMN "domain",
ADD COLUMN     "subDomain" TEXT NOT NULL;
