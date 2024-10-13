/*
  Warnings:

  - A unique constraint covering the columns `[subDomain]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customDomain]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Team_id_customDomain_key";

-- DropIndex
DROP INDEX "Team_id_subDomain_key";

-- CreateIndex
CREATE UNIQUE INDEX "Team_subDomain_key" ON "Team"("subDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Team_customDomain_key" ON "Team"("customDomain");
