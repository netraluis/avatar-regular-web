-- CreateEnum
CREATE TYPE "EntryPointsType" AS ENUM ('REGULAR');

-- CreateTable
CREATE TABLE "EntryPoints" (
    "id" TEXT NOT NULL,
    "type" "EntryPointsType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "EntryPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryPoint" (
    "id" TEXT NOT NULL,
    "numberOrder" INTEGER NOT NULL,
    "entryPointId" TEXT,

    CONSTRAINT "EntryPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryPointLanguages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "entryPointId" TEXT NOT NULL,

    CONSTRAINT "EntryPointLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntryPoints_teamId_key" ON "EntryPoints"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "EntryPointLanguages_entryPointId_language_key" ON "EntryPointLanguages"("entryPointId", "language");

-- AddForeignKey
ALTER TABLE "EntryPoints" ADD CONSTRAINT "EntryPoints_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryPoint" ADD CONSTRAINT "EntryPoint_entryPointId_fkey" FOREIGN KEY ("entryPointId") REFERENCES "EntryPoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryPointLanguages" ADD CONSTRAINT "EntryPointLanguages_entryPointId_fkey" FOREIGN KEY ("entryPointId") REFERENCES "EntryPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
