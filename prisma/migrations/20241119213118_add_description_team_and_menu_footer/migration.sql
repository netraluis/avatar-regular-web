-- CreateEnum
CREATE TYPE "MenuFooterType" AS ENUM ('PLAIN');

-- CreateTable
CREATE TABLE "TeamDescription" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuFooter" (
    "id" TEXT NOT NULL,
    "type" "MenuFooterType" NOT NULL DEFAULT 'PLAIN',
    "text" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "MenuFooter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamDescription_language_teamId_key" ON "TeamDescription"("language", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuFooter_language_teamId_key" ON "MenuFooter"("language", "teamId");

-- AddForeignKey
ALTER TABLE "TeamDescription" ADD CONSTRAINT "TeamDescription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuFooter" ADD CONSTRAINT "MenuFooter_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
