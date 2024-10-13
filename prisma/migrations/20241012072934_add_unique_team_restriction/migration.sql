/*
  Warnings:

  - A unique constraint covering the columns `[id,subDomain]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,customDomain]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Made the column `subDomain` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "subDomain" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_id_subDomain_key" ON "Team"("id", "subDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Team_id_customDomain_key" ON "Team"("id", "customDomain");
