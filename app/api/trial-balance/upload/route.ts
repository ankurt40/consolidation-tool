import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import * as XLSX from 'xlsx';

const REQUIRED_COLUMNS = [
  'legalEntityCode',
  'entityType',
  'localGlAccount',
  'localAccountDescription',
  'businessUnit',
  'debitAmount',
  'creditAmount',
  'netAmount',
  'groupCoa',
  'groupDescription',
  'fsliDetailLowestLevel',
  'fsliGroupCategory',
  'fsliClassification',
  'fsCategory',
  'fsliLevel5',
];

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel
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
      const rowNum = idx + 2; // +2 for 1-based + header row
      if (!row.legalEntityCode) errors.push(`Row ${rowNum}: legalEntityCode is required`);
      if (!row.localGlAccount) errors.push(`Row ${rowNum}: localGlAccount is required`);
      if (!row.groupCoa) errors.push(`Row ${rowNum}: groupCoa is required`);

      return {
        tenantId: user.tenantId,
        legalEntityCode: String(row.legalEntityCode || '').trim(),
        entityType: String(row.entityType || '').trim(),
        localGlAccount: String(row.localGlAccount || '').trim(),
        localAccountDescription: String(row.localAccountDescription || '').trim(),
        businessUnit: String(row.businessUnit || '').trim(),
        debitAmount: parseFloat(row.debitAmount) || 0,
        creditAmount: parseFloat(row.creditAmount) || 0,
        netAmount: parseFloat(row.netAmount) || 0,
        groupCoa: String(row.groupCoa || '').trim(),
        groupDescription: String(row.groupDescription || '').trim(),
        fsliDetailLowestLevel: String(row.fsliDetailLowestLevel || '').trim(),
        fsliGroupCategory: String(row.fsliGroupCategory || '').trim(),
        fsliClassification: String(row.fsliClassification || '').trim(),
        fsCategory: String(row.fsCategory || '').trim(),
        fsliLevel5: String(row.fsliLevel5 || '').trim(),
      };
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: `Validation errors:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n...and ${errors.length - 10} more` : ''}` },
        { status: 400 }
      );
    }

    // Bulk insert using createMany
    const result = await prisma.trialBalance.createMany({
      data: validRows,
      skipDuplicates: false,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully uploaded ${result.count} trial balance entries`,
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload trial balance', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

