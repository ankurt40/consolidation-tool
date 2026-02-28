import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const sampleData = [
      {
        journalDate: '2026-01-31',
        referenceDate: '2026-01-31',
        legalEntityCode: 'LE001',
        coa: '11000',
        coaDescription: 'Cash at Bank - Elimination',
        businessUnit: 'Corporate HQ',
        debitAmount: 50000.00,
        creditAmount: 0,
        netAmount: 50000.00,
        impact: 'Balance Sheet',
        adjustmentType: 'Elimination',
        currencyCode: 'USD',
        description: 'Eliminate intercompany cash balance',
      },
      {
        journalDate: '2026-01-31',
        referenceDate: '2026-01-31',
        legalEntityCode: 'LE001',
        coa: '21000',
        coaDescription: 'Intercompany Payable',
        businessUnit: 'Corporate HQ',
        debitAmount: 0,
        creditAmount: 50000.00,
        netAmount: -50000.00,
        impact: 'Balance Sheet',
        adjustmentType: 'Elimination',
        currencyCode: 'USD',
        description: 'Eliminate intercompany payable balance',
      },
      {
        journalDate: '2026-02-15',
        referenceDate: '2026-01-31',
        legalEntityCode: 'LE002',
        coa: '40000',
        coaDescription: 'Revenue - Intercompany',
        businessUnit: 'North America Division',
        debitAmount: 120000.00,
        creditAmount: 0,
        netAmount: 120000.00,
        impact: 'Income Statement',
        adjustmentType: 'Intercompany',
        currencyCode: 'USD',
        description: 'Eliminate IC revenue',
      },
      {
        journalDate: '2026-02-15',
        referenceDate: '2026-01-31',
        legalEntityCode: 'LE002',
        coa: '50000',
        coaDescription: 'COGS - Intercompany',
        businessUnit: 'North America Division',
        debitAmount: 0,
        creditAmount: 120000.00,
        netAmount: -120000.00,
        impact: 'Income Statement',
        adjustmentType: 'Intercompany',
        currencyCode: 'USD',
        description: 'Eliminate IC COGS',
      },
      {
        journalDate: '2026-02-28',
        referenceDate: '',
        legalEntityCode: 'LE003',
        coa: '31000',
        coaDescription: 'Translation Reserve',
        businessUnit: 'Europe Division',
        debitAmount: 8500.00,
        creditAmount: 0,
        netAmount: 8500.00,
        impact: 'Equity',
        adjustmentType: 'Translation',
        currencyCode: 'EUR',
        description: 'CTA adjustment for EUR subsidiary',
      },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);

    ws['!cols'] = [
      { wch: 14 }, // journalDate
      { wch: 14 }, // referenceDate
      { wch: 18 }, // legalEntityCode
      { wch: 10 }, // coa
      { wch: 32 }, // coaDescription
      { wch: 24 }, // businessUnit
      { wch: 14 }, // debitAmount
      { wch: 14 }, // creditAmount
      { wch: 14 }, // netAmount
      { wch: 18 }, // impact
      { wch: 16 }, // adjustmentType
      { wch: 10 }, // currencyCode
      { wch: 40 }, // description
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Journal Entries');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="journal_entries_sample.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating sample:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate sample file' }, { status: 500 });
  }
}

