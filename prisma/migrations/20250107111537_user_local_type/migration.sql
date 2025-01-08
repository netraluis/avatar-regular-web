-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('OWNER', 'ADMIN');

-- AlterEnum
ALTER TYPE "RoleUserType" ADD VALUE 'OBSERVER';

-- AlterTable
ALTER TABLE "UserTeam" ADD COLUMN     "type" "UserType";
