-- AlterTable
ALTER TABLE "Domains" ADD COLUMN     "symbol" TEXT,
ALTER COLUMN "logo" DROP NOT NULL;
