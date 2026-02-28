import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const trialBalances = await prisma.trialBalance.findMany({
      where: {
        tenantId: user.tenantId
      },
      orderBy: {
        legalEntityCode: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      trialBalances
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trial balances',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    // Convert amount strings to decimals
    const trialBalanceData = {
      ...data,
      tenantId: user.tenantId,
      debitAmount: parseFloat(data.debitAmount) || 0,
      creditAmount: parseFloat(data.creditAmount) || 0,
      netAmount: parseFloat(data.netAmount) || 0,
    };

    const newTrialBalance = await prisma.trialBalance.create({
      data: trialBalanceData
    });

    return NextResponse.json({
      success: true,
      trialBalance: newTrialBalance
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create trial balance entry',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

