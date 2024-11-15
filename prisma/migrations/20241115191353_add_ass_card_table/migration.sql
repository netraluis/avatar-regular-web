-- CreateEnum
CREATE TYPE "AssistantCardType" AS ENUM ('REGULAR');

-- CreateTable
CREATE TABLE "AssistantCard" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT[],
    "type" "AssistantCardType" NOT NULL,
    "language" "LanguageType" NOT NULL,
    "assistantId" TEXT NOT NULL,

    CONSTRAINT "AssistantCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssistantCard_language_assistantId_key" ON "AssistantCard"("language", "assistantId");

-- AddForeignKey
ALTER TABLE "AssistantCard" ADD CONSTRAINT "AssistantCard_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
