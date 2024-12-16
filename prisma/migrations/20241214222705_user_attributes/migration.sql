-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "language" "LanguageType" NOT NULL DEFAULT 'CA',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "surname" TEXT;
