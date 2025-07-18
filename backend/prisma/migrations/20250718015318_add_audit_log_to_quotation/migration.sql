-- AlterTable
ALTER TABLE "quotation" ADD COLUMN     "audit_log" JSONB DEFAULT '[]';
