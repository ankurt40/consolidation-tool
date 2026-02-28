import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import * as XLSX from 'xlsx';

const REQUIRED_COLUMNS = [
  'journalDate',
  'legalEntityCode',
  'coa',
  'coaDescription',
  'businessUnit',
  'debitAmount',
  'creditAmount',
  'netAmount',
  'impact',
  'adjustmentType',
  'currencyCode',
];

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ success: false, error: 'Excel file has no sheets' }, { status: 400 });
    }

    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Excel file has no data rows' }, { status: 400 });
    }

    // Validate columns
    const fileColumns = Object.keys(rows[0]);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !fileColumns.includes(col));
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required columns: ${missingColumns.join(', ')}. Download the sample file for the correct format.` },
        { status: 400 }
      );
    }

    // Validate and transform rows
    const errors: string[] = [];
    const validRows = rows.map((row, idx) => {
      const rowNum = idx + 2;
      if (!row.journalDate) errors.push(`Row ${rowNum}: journalDate is required`);
      if (!row.legalEntityCode) errors.push(`Row ${rowNum}: legalEntityCode is required`);
      if (!row.coa) errors.push(`Row ${rowNum}: coa is required`);
      if (!row.impact) errors.push(`Row ${rowNum}: impact is required`);
      if (!row.adjustmentType) errors.push(`Row ${rowNum}: adjustmentType is required`);

      // Parse date — handle Excel serial numbers and string dates
      let journalDate: Date;
      if (typeof row.journalDate === 'number') {
        // Excel serial date number
        journalDate = new Date((row.journalDate - 25569) * 86400 * 1000);
      } else {
        journalDate = new Date(row.journalDate);
      }

      let referenceDate: Date | null = null;
      if (row.referenceDate) {
        if (typeof row.referenceDate === 'number') {
          referenceDate = new Date((row.referenceDate - 25569) * 86400 * 1000);
        } else {
          referenceDate = new Date(row.referenceDate);
        }
      }

      return {
        tenantId: user.tenantId,
        journalDate,
        referenceDate,
        legalEntityCode: String(row.legalEntityCode || '').trim(),
        coa: String(row.coa || '').trim(),
        coaDescription: String(row.coaDescription || '').trim(),
        businessUnit: String(row.businessUnit || '').trim(),
        debitAmount: parseFloat(row.debitAmount) || 0,
        creditAmount: parseFloat(row.creditAmount) || 0,
        netAmount: parseFloat(row.netAmount) || 0,
        impact: String(row.impact || '').trim(),
        adjustmentType: String(row.adjustmentType || '').trim(),
        currencyCode: String(row.currencyCode || 'USD').trim(),
        description: row.description ? String(row.description).trim() : null,
      };
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: `Validation errors:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n...and ${errors.length - 10} more` : ''}` },
        { status: 400 }
      );
    }

    const result = await prisma.journalEntry.createMany({
      data: validRows,
      skipDuplicates: false,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully uploaded ${result.count} journal entries`,
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload journal entries', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

