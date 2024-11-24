/*
  Warnings:

  - A unique constraint covering the columns `[language,teamId]` on the table `HeaderButton` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HeaderButton_language_teamId_key" ON "HeaderButton"("language", "teamId");
