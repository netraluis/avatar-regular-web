/*
  Warnings:

  - A unique constraint covering the columns `[assistantId,type]` on the table `EntryPoints` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EntryPoints_assistantId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EntryPoints_assistantId_type_key" ON "EntryPoints"("assistantId", "type");
