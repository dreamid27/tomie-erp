/*
  Warnings:

  - Added the required column `product_id` to the `quotation_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quotation_detail" ADD COLUMN     "note" TEXT,
ADD COLUMN     "product_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "quotation_detail" ADD CONSTRAINT "quotation_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
