/*
  Warnings:

  - You are about to alter the column `total_area` on the `farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(30,2)`.
  - You are about to alter the column `cultivable_area` on the `farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `preserved_area` on the `farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "farm" ALTER COLUMN "total_area" SET DATA TYPE DECIMAL(30,2),
ALTER COLUMN "cultivable_area" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "preserved_area" SET DATA TYPE DECIMAL(10,2);
