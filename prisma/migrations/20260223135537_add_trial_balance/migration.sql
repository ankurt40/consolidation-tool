/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "employee";

-- CreateTable
CREATE TABLE "trial_balance" (
    "id" SERIAL NOT NULL,
    "legal_entity_code" VARCHAR(50) NOT NULL,
    "local_gl_account" VARCHAR(50) NOT NULL,
    "local_account_description" VARCHAR(500) NOT NULL,
    "business_unit" VARCHAR(200) NOT NULL,
    "debit_amount" DECIMAL(20,2) NOT NULL,
    "credit_amount" DECIMAL(20,2) NOT NULL,
    "net_amount" DECIMAL(20,2) NOT NULL,
    "group_coa" VARCHAR(50) NOT NULL,
    "group_description" VARCHAR(500) NOT NULL,
    "fsli_detail_lowest_level" VARCHAR(200) NOT NULL,
    "fsli_group_category" VARCHAR(200) NOT NULL,
    "fsli_classification" VARCHAR(200) NOT NULL,
    "fs_category" VARCHAR(200) NOT NULL,
    "fsli_level_5" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trial_balance_pkey" PRIMARY KEY ("id")
);
