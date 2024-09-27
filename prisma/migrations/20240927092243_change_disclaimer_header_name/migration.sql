/*
  Warnings:

  - You are about to drop the column `HeaderDisclaimer` on the `Domains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domains" DROP COLUMN "HeaderDisclaimer",
ADD COLUMN     "headerDisclaimer" JSONB;
