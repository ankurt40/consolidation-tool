import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const entry = await prisma.journalEntry.findFirst({
      where: { id: parseInt(id), tenantId: user.tenantId },
    });

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Journal entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, journalEntry: entry });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch journal entry' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.journalEntry.findFirst({
      where: { id: parseInt(id), tenantId: user.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Journal entry not found' }, { status: 404 });
    }

    const updateData = {
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

    const updated = await prisma.journalEntry.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, journalEntry: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existing = await prisma.journalEntry.findFirst({
      where: { id: parseInt(id), tenantId: user.tenantId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Journal entry not found' }, { status: 404 });
    }

    await prisma.journalEntry.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: 'Journal entry deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete journal entry' }, { status: 500 });
  }
}

