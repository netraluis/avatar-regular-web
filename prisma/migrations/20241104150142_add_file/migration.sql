/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "file";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "openAIVectorStoreId" TEXT NOT NULL,
    "openAiFileId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
