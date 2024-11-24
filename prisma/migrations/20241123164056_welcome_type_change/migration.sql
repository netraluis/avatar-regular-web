/*
  Warnings:

  - The values [GLOVE] on the enum `WelcomeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WelcomeType_new" AS ENUM ('PLAIN', 'BUBBLE');
ALTER TABLE "Welcome" ALTER COLUMN "type" TYPE "WelcomeType_new" USING ("type"::text::"WelcomeType_new");
ALTER TYPE "WelcomeType" RENAME TO "WelcomeType_old";
ALTER TYPE "WelcomeType_new" RENAME TO "WelcomeType";
DROP TYPE "WelcomeType_old";
COMMIT;
