-- DropForeignKey
ALTER TABLE "farm" DROP CONSTRAINT "farm_producer_id_fkey";

-- DropForeignKey
ALTER TABLE "farm_cultivation" DROP CONSTRAINT "farm_cultivation_farm_id_fkey";

-- AddForeignKey
ALTER TABLE "farm" ADD CONSTRAINT "farm_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_cultivation" ADD CONSTRAINT "farm_cultivation_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
