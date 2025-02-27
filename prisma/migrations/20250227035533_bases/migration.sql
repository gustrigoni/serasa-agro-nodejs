-- CreateTable
CREATE TABLE "producer" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(75) NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm" (
    "id" SERIAL NOT NULL,
    "farm_name" VARCHAR(100) NOT NULL,
    "producer_id" INTEGER NOT NULL,
    "city" VARCHAR(25) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "total_area" DECIMAL(30,2) NOT NULL,
    "cultivable_area" DECIMAL(10,2) NOT NULL,
    "preserved_area" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_cultivation" (
    "id" SERIAL NOT NULL,
    "cultivation_name" VARCHAR(50) NOT NULL,
    "farm_id" INTEGER NOT NULL,
    "cultivated_area" DECIMAL(10,2) NOT NULL,
    "harvest" VARCHAR(4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_cultivation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "producer_document_key" ON "producer"("document");

-- AddForeignKey
ALTER TABLE "farm" ADD CONSTRAINT "farm_producer_id_fkey" FOREIGN KEY ("producer_id") REFERENCES "producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm_cultivation" ADD CONSTRAINT "farm_cultivation_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
