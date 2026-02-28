import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Sample data matching the TrialBalance schema columns
    const sampleData = [
      {
        legalEntityCode: 'LE001',
        entityType: 'Parent',
        localGlAccount: '11000',
        localAccountDescription: 'Cash at Bank - Main Account',
        businessUnit: 'Corporate HQ',
        debitAmount: 150000.00,
        creditAmount: 0,
        netAmount: 150000.00,
        groupCoa: '100001',
        groupDescription: 'Cash and Cash Equivalents',
        fsliDetailLowestLevel: 'Cash and Cash Equivalents',
        fsliGroupCategory: 'Cash and Cash Equivalents',
        fsliClassification: 'Current Assets',
        fsCategory: 'Assets',
        fsliLevel5: 'Balance Sheet',
      },
      {
        legalEntityCode: 'LE001',
        entityType: 'Parent',
        localGlAccount: '12000',
        localAccountDescription: 'Accounts Receivable - Trade',
        businessUnit: 'Corporate HQ',
        debitAmount: 85000.00,
        creditAmount: 0,
        netAmount: 85000.00,
        groupCoa: '100010',
        groupDescription: 'Trade Receivables',
        fsliDetailLowestLevel: 'Trade and Other Receivables',
        fsliGroupCategory: 'Receivables',
        fsliClassification: 'Current Assets',
        fsCategory: 'Assets',
        fsliLevel5: 'Balance Sheet',
      },
      {
        legalEntityCode: 'LE001',
        entityType: 'Parent',
        localGlAccount: '21000',
        localAccountDescription: 'Accounts Payable - Trade',
        businessUnit: 'Corporate HQ',
        debitAmount: 0,
        creditAmount: 62000.00,
        netAmount: -62000.00,
        groupCoa: '200001',
        groupDescription: 'Trade Payables',
        fsliDetailLowestLevel: 'Trade and Other Payables',
        fsliGroupCategory: 'Payables',
        fsliClassification: 'Current Liabilities',
        fsCategory: 'Liabilities',
        fsliLevel5: 'Balance Sheet',
      },
      {
        legalEntityCode: 'LE002',
        entityType: 'Subsidiary',
        localGlAccount: '40000',
        localAccountDescription: 'Revenue - Product Sales',
        businessUnit: 'North America Division',
        debitAmount: 0,
        creditAmount: 500000.00,
        netAmount: -500000.00,
        groupCoa: '400001',
        groupDescription: 'Product Revenue',
        fsliDetailLowestLevel: 'Revenue from Contracts',
        fsliGroupCategory: 'Revenue',
        fsliClassification: 'Revenue',
        fsCategory: 'Income',
        fsliLevel5: 'Income Statement',
      },
      {
        legalEntityCode: 'LE002',
        entityType: 'Subsidiary',
        localGlAccount: '50000',
        localAccountDescription: 'Cost of Goods Sold',
        businessUnit: 'North America Division',
        debitAmount: 320000.00,
        creditAmount: 0,
        netAmount: 320000.00,
        groupCoa: '500001',
        groupDescription: 'Cost of Sales',
        fsliDetailLowestLevel: 'Cost of Sales',
        fsliGroupCategory: 'Cost of Sales',
        fsliClassification: 'Cost of Sales',
        fsCategory: 'Expenses',
        fsliLevel5: 'Income Statement',
      },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Set column widths
    ws['!cols'] = [
      { wch: 18 }, // legalEntityCode
      { wch: 14 }, // entityType
      { wch: 16 }, // localGlAccount
      { wch: 35 }, // localAccountDescription
      { wch: 25 }, // businessUnit
      { wch: 14 }, // debitAmount
      { wch: 14 }, // creditAmount
      { wch: 14 }, // netAmount
      { wch: 12 }, // groupCoa
      { wch: 28 }, // groupDescription
      { wch: 30 }, // fsliDetailLowestLevel
      { wch: 25 }, // fsliGroupCategory
      { wch: 22 }, // fsliClassification
      { wch: 14 }, // fsCategory
      { wch: 30 }, // fsliLevel5
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Trial Balance');

    // Write to buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="trial_balance_sample.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating sample:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate sample file' }, { status: 500 });
  }
}

