/*
  Warnings:

  - You are about to drop the column `language` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `emoji` on the `AssistantCard` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `AssistantCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "language",
ADD COLUMN     "emoji" TEXT;

-- AlterTable
ALTER TABLE "AssistantCard" DROP COLUMN "emoji",
DROP COLUMN "text",
ADD COLUMN     "description" TEXT[];
