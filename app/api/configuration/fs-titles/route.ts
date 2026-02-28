import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const config = await prisma.financialStatementTitles.findUnique({
      where: { tenantId: user.tenantId },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial statement titles' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    if (!user.tenantId) {
      return NextResponse.json(
        { success: false, error: 'No tenant ID found. Please log out and log back in.' },
        { status: 401 }
      );
    }

    const existing = await prisma.financialStatementTitles.findUnique({
      where: { tenantId: user.tenantId },
    });

    let config;
    if (existing) {
      config = await prisma.financialStatementTitles.update({
        where: { tenantId: user.tenantId },
        data: {
          balanceSheetTitle: data.balanceSheetTitle,
          profitAndLossTitle: data.profitAndLossTitle,
          cashFlowTitle: data.cashFlowTitle,
          socieTitle: data.socieTitle,
          notesTitle: data.notesTitle,
        },
      });
    } else {
      config = await prisma.financialStatementTitles.create({
        data: {
          tenantId: user.tenantId,
          balanceSheetTitle: data.balanceSheetTitle,
          profitAndLossTitle: data.profitAndLossTitle,
          cashFlowTitle: data.cashFlowTitle,
          socieTitle: data.socieTitle,
          notesTitle: data.notesTitle,
        },
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save financial statement titles', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

