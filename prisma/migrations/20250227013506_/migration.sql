/*
  Warnings:

  - Changed the type of `cultivated_area` on the `farm_cultivation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "farm_cultivation" ALTER COLUMN "cultivated_area" SET DATA TYPE DECIMAL(10,2);
