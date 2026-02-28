import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.financialStatementTitles.deleteMany();
  await prisma.periodConfiguration.deleteMany();
  await prisma.systemConfiguration.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.trialBalance.deleteMany();
  await prisma.legalEntityMaster.deleteMany();
  await prisma.customer.deleteMany();

  // Create a demo customer
  const demoCustomer = await prisma.customer.create({
    data: {
      email: 'demo@example.com',
      passwordHash: await bcrypt.hash('demo1234', 10),
      companyName: 'Demo Corporation',
      tenantId: 'tenant_demo_001',
      isActive: true,
    },
  });

  console.log(`✅ Created demo customer: ${demoCustomer.email}`);
  console.log(`📧 Demo credentials - Email: demo@example.com, Password: demo1234`);

  const tenantId = demoCustomer.tenantId;

  // Insert sample legal entities for demo customer
  const legalEntitiesData = [
    {
      tenantId,
      leCode: 'LE001',
      leName: 'Parent Corporation Inc.',
      parentEntity: null,
      entityType: 'Holding Company',
      country: 'United States',
      ownershipPercentDirect: 100.00,
      totalOwnershipPercent: 100.00,
      votingRightsPercent: 100.00,
      controlIndicator: 'Full Control',
      consolidationPercent: 100.00,
      consolidationMethod: 'Full Consolidation',
      consolidationStructure: 'Parent',
      localCurrency: 'USD',
      functionalCurrency: 'USD',
      entityClassification: 'Parent Entity',
      fiscalYearEnd: 'December 31',
      primaryGAAP: 'US GAAP',
      entityJurisdiction: 'Delaware',
      taxId: '12-3456789',
      legalForm: 'Corporation',
    },
    {
      tenantId,
      leCode: 'LE002',
      leName: 'Subsidiary A Ltd.',
      parentEntity: 'LE001',
      entityType: 'Operating Company',
      country: 'United Kingdom',
      ownershipPercentDirect: 100.00,
      totalOwnershipPercent: 100.00,
      nciPercent: 0.00,
      votingRightsPercent: 100.00,
      controlIndicator: 'Full Control',
      consolidationPercent: 100.00,
      consolidationMethod: 'Full Consolidation',
      consolidationStructure: 'Subsidiary',
      localCurrency: 'GBP',
      functionalCurrency: 'GBP',
      intermediateCurrency: 'USD',
      entityClassification: 'Subsidiary',
      fiscalYearEnd: 'December 31',
      primaryGAAP: 'IFRS',
      secondaryGAAP: 'UK GAAP',
      acquisitionDate: new Date('2020-01-15'),
      entityJurisdiction: 'England and Wales',
      taxId: 'GB123456789',
      legalForm: 'Limited Company',
    },
  ];

  const legalEntities = await prisma.legalEntityMaster.createMany({
    data: legalEntitiesData,
  });

  console.log(`✅ Seeded ${legalEntities.count} legal entities`);

  // Insert sample trial balance entries
  const trialBalanceData = [
    {
      tenantId,
      legalEntityCode: 'LE001',
      entityType: 'Parent',
      localGlAccount: '11000',
      localAccountDescription: 'Cash at Bank (USD)',
      businessUnit: 'North America Division',
      debitAmount: 19770967,
      creditAmount: 0,
      netAmount: 19770967,
      groupCoa: '100002',
      groupDescription: 'Cash at Bank',
      fsliDetailLowestLevel: 'Cash and Cash Equivalents',
      fsliGroupCategory: 'Cash and Cash Equivalents',
      fsliClassification: 'Current Assets',
      fsCategory: 'Assets',
      fsliLevel5: 'Balance Sheet',
    },
    {
      tenantId,
      legalEntityCode: 'LE001',
      entityType: 'Parent',
      localGlAccount: '11001',
      localAccountDescription: 'Cash on Hand (USD)',
      businessUnit: 'North America Division',
      debitAmount: 220015,
      creditAmount: 0,
      netAmount: 220015,
      groupCoa: '100001',
      groupDescription: 'Cash on Hand',
      fsliDetailLowestLevel: 'Cash and Cash Equivalents',
      fsliGroupCategory: 'Cash and Cash Equivalents',
      fsliClassification: 'Current Assets',
      fsCategory: 'Assets',
      fsliLevel5: 'Balance Sheet',
    },
  ];

  const trialBalances = await prisma.trialBalance.createMany({
    data: trialBalanceData,
  });

  console.log(`✅ Seeded ${trialBalances.count} trial balance entries`);

  // Insert default system configuration
  await prisma.systemConfiguration.create({
    data: {
      tenantId,
      groupReportingCurrency: 'USD',
      gaap: 'IFRS',
      epsCalc: 'Basic',
      numberFormat: '1,234,567.89',
      decimalPlaces: 2,
      thousandSeparator: ',',
      decimalSeparator: '.',
      scale: 'Thousands (K)',
      scaleShowIn: "000's",
      scaleSuffix: 'K',
      presentation: 'Thousands (K)',
      negativeNumberFormat: '(1,000)',
      plugBs: 'Retained Earnings',
      plugPl: 'OCI',
      zeroDisplay: '0.00',
      language: 'English',
    },
  });

  console.log('✅ Seeded system configuration');

  // Insert default period configuration
  await prisma.periodConfiguration.create({
    data: {
      tenantId,
      currentYearDate: new Date('2026-02-28'),
      previousYearDate: new Date('2025-02-28'),
      priorPeriodYearDate: new Date('2024-02-29'),
      fyStart: 'January',
      numberOfPeriods: 12,
      comparativePeriodsBs: '1',
      fiscalYearType: 'Calendar Year',
      yearEndRule: null,
    },
  });

  console.log('✅ Seeded period configuration');

  // Insert default financial statement titles
  await prisma.financialStatementTitles.create({
    data: {
      tenantId,
      balanceSheetTitle: 'Statement of Financial Position for the year/period ended December 31, 2026',
      profitAndLossTitle: 'Statement of Profit and Loss for the period ended December 31, 2026',
      cashFlowTitle: 'Statement of Cash Flows',
      socieTitle: 'Statement of Changes in Equity',
      notesTitle: 'Notes to the Financial Statements',
    },
  });

  console.log('✅ Seeded financial statement titles');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

