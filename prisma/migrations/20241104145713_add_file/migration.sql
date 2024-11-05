-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "openAIVectorStoreId" TEXT NOT NULL,
    "openAiFileId" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);
