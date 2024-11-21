-- CreateEnum
CREATE TYPE "ModeMessageType" AS ENUM ('TEST', 'PROD');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mode" "ModeMessageType";
