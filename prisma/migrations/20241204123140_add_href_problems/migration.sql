-- DropForeignKey
ALTER TABLE "TextHref" DROP CONSTRAINT "TextHref_defaultTextHrefId_fkey";

-- DropIndex
DROP INDEX "TextHref_defaultTextHrefId_language_key";

-- AlterTable
ALTER TABLE "TextHref" ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "href" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL;

-- CreateTable
CREATE TABLE "HrefLanguages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "language" "LanguageType" NOT NULL,
    "textHrefId" TEXT NOT NULL,

    CONSTRAINT "HrefLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrefLanguages_textHrefId_language_key" ON "HrefLanguages"("textHrefId", "language");

-- AddForeignKey
ALTER TABLE "HrefLanguages" ADD CONSTRAINT "HrefLanguages_textHrefId_fkey" FOREIGN KEY ("textHrefId") REFERENCES "TextHref"("id") ON DELETE CASCADE ON UPDATE CASCADE;
