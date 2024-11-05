/*
  Warnings:

  - Added the required column `bytes` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FILE', 'NOTION');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "bytes" INTEGER NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "type" "FileType" NOT NULL;
