/*
  Warnings:

  - A unique constraint covering the columns `[openAiFileId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_openAiFileId_key" ON "File"("openAiFileId");
