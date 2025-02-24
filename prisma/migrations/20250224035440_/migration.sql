/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `producer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "producer_document_key" ON "producer"("document");
