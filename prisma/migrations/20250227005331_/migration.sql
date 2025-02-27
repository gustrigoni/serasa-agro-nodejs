/*
  Warnings:

  - You are about to alter the column `cultivation_name` on the `farm_cultivation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "farm_cultivation" ALTER COLUMN "cultivation_name" SET DATA TYPE VARCHAR(50);
