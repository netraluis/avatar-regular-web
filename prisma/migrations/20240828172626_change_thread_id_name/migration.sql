/*
  Warnings:

  - You are about to drop the column `thread` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - Added the required column `threadId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "thread",
DROP COLUMN "updatedAt",
ADD COLUMN     "threadId" TEXT NOT NULL;
