/*
  Warnings:

  - Added the required column `question` to the `EntryPointLanguages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntryPointLanguages" ADD COLUMN     "question" TEXT NOT NULL;
