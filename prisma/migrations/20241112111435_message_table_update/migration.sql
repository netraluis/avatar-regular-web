/*
  Warnings:

  - You are about to drop the column `domainId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `usageTotalTokens` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleUserType" AS ENUM ('ASSISTANT', 'USER');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_assistantId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "domainId",
ADD COLUMN     "filesId" TEXT[],
ADD COLUMN     "usageTotalTokens" INTEGER NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "RoleUserType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
