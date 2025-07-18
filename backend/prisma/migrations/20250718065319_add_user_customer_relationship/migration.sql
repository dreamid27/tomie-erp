-- AlterTable
ALTER TABLE "user" ADD COLUMN     "customer_id" UUID;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
