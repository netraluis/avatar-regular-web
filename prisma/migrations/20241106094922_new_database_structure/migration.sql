/*
  Warnings:

  - The `status` column on the `Assistant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `avatarId` to the `Assistant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Assistant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultLanguage` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssitantStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "WelcomeType" AS ENUM ('PLAIN', 'GLOVE');

-- CreateEnum
CREATE TYPE "MenuHeaderType" AS ENUM ('HEADER', 'BODY', 'FOOTER');

-- CreateEnum
CREATE TYPE "LanguageType" AS ENUM ('EN', 'ES', 'FR', 'CA');

-- AlterTable
ALTER TABLE "Assistant" ADD COLUMN     "avatarId" TEXT NOT NULL,
ADD COLUMN     "language" "LanguageType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AssitantStatus" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "defaultLanguage" "LanguageType" NOT NULL,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "symbolUrl" TEXT;

-- DropEnum
DROP TYPE "AsssitantStatus";

-- CreateTable
CREATE TABLE "HeaderButton" (
    "id" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "buttonType" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "HeaderButton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuHeader" (
    "id" TEXT NOT NULL,
    "type" "MenuHeaderType" NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "MenuHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextHref" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "numberOrder" INTEGER NOT NULL,
    "menuHeaderId" TEXT,
    "headerButtonId" TEXT,

    CONSTRAINT "TextHref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Welcome" (
    "id" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "text" TEXT[],
    "type" "WelcomeType" NOT NULL,
    "description" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "voiceAvatarId" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuHeader_teamId_key" ON "MenuHeader"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Welcome_teamId_key" ON "Welcome"("teamId");

-- AddForeignKey
ALTER TABLE "HeaderButton" ADD CONSTRAINT "HeaderButton_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuHeader" ADD CONSTRAINT "MenuHeader_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextHref" ADD CONSTRAINT "TextHref_menuHeaderId_fkey" FOREIGN KEY ("menuHeaderId") REFERENCES "MenuHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextHref" ADD CONSTRAINT "TextHref_headerButtonId_fkey" FOREIGN KEY ("headerButtonId") REFERENCES "HeaderButton"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Welcome" ADD CONSTRAINT "Welcome_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
