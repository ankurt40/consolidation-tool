import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const journalEntries = await prisma.journalEntry.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { journalDate: 'desc' },
    });

    return NextResponse.json({ success: true, journalEntries });
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const entryData = {
      tenantId: user.tenantId,
      journalDate: new Date(data.journalDate),
      referenceDate: data.referenceDate ? new Date(data.referenceDate) : null,
      legalEntityCode: data.legalEntityCode,
      coa: data.coa,
      coaDescription: data.coaDescription,
      businessUnit: data.businessUnit,
      debitAmount: parseFloat(data.debitAmount) || 0,
      creditAmount: parseFloat(data.creditAmount) || 0,
      netAmount: parseFloat(data.netAmount) || 0,
      impact: data.impact,
      adjustmentType: data.adjustmentType,
      currencyCode: data.currencyCode,
      description: data.description || null,
    };

    const newEntry = await prisma.journalEntry.create({ data: entryData });

    return NextResponse.json({ success: true, journalEntry: newEntry });
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

