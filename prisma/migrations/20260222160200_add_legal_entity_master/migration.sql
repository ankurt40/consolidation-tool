-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_entity_master" (
    "id" SERIAL NOT NULL,
    "le_code" VARCHAR(50) NOT NULL,
    "le_name" VARCHAR(200) NOT NULL,
    "parent_entity" VARCHAR(50),
    "entity_type" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "ownership_percent_direct" DECIMAL(5,2),
    "ownership_percent_indirect" DECIMAL(5,2),
    "total_ownership_percent" DECIMAL(5,2),
    "nci_percent" DECIMAL(5,2),
    "voting_rights_percent" DECIMAL(5,2),
    "control_indicator" VARCHAR(50),
    "consolidation_percent" DECIMAL(5,2),
    "consolidation_method" VARCHAR(100),
    "consolidation_structure" VARCHAR(100),
    "local_currency" VARCHAR(10) NOT NULL,
    "functional_currency" VARCHAR(10) NOT NULL,
    "intermediate_currency" VARCHAR(10),
    "entity_classification" VARCHAR(100) NOT NULL,
    "fiscal_year_end" VARCHAR(20) NOT NULL,
    "primary_gaap" VARCHAR(50) NOT NULL,
    "secondary_gaap" VARCHAR(50),
    "acquisition_date" DATE,
    "disposal_date" DATE,
    "entity_jurisdiction" VARCHAR(100) NOT NULL,
    "tax_id" VARCHAR(50),
    "legal_form" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_entity_master_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "legal_entity_master_le_code_key" ON "legal_entity_master"("le_code");
