-- CreateEnum
CREATE TYPE "FooterType" AS ENUM ('PLAIN');

-- CreateTable
CREATE TABLE "Footer" (
    "id" TEXT NOT NULL,
    "type" "FooterType" NOT NULL DEFAULT 'PLAIN',
    "text" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Footer_language_teamId_key" ON "Footer"("language", "teamId");

-- AddForeignKey
ALTER TABLE "Footer" ADD CONSTRAINT "Footer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
