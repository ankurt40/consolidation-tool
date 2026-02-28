/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,le_code]` on the table `legal_entity_master` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `legal_entity_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `trial_balance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "legal_entity_master_le_code_key";

-- AlterTable
ALTER TABLE "legal_entity_master" ADD COLUMN     "tenant_id" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "trial_balance" ADD COLUMN     "tenant_id" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_tenant_id_key" ON "customers"("tenant_id");

-- CreateIndex
CREATE INDEX "legal_entity_master_tenant_id_idx" ON "legal_entity_master"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "legal_entity_master_tenant_id_le_code_key" ON "legal_entity_master"("tenant_id", "le_code");

-- CreateIndex
CREATE INDEX "trial_balance_tenant_id_idx" ON "trial_balance"("tenant_id");

-- AddForeignKey
ALTER TABLE "legal_entity_master" ADD CONSTRAINT "legal_entity_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "customers"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_balance" ADD CONSTRAINT "trial_balance_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "customers"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;
