import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const trialBalance = await prisma.trialBalance.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!trialBalance) {
      return NextResponse.json(
        { success: false, error: 'Trial balance entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trialBalance
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trial balance entry',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    // Verify trial balance belongs to tenant
    const existingTrialBalance = await prisma.trialBalance.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!existingTrialBalance) {
      return NextResponse.json(
        { success: false, error: 'Trial balance entry not found' },
        { status: 404 }
      );
    }

    // Convert amount strings to decimals
    const trialBalanceData = {
      ...data,
      debitAmount: parseFloat(data.debitAmount) || 0,
      creditAmount: parseFloat(data.creditAmount) || 0,
      netAmount: parseFloat(data.netAmount) || 0,
    };

    const updatedTrialBalance = await prisma.trialBalance.update({
      where: { id: parseInt(id) },
      data: trialBalanceData
    });

    return NextResponse.json({
      success: true,
      trialBalance: updatedTrialBalance
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update trial balance entry',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify trial balance belongs to tenant before deleting
    const trialBalance = await prisma.trialBalance.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!trialBalance) {
      return NextResponse.json(
        { success: false, error: 'Trial balance entry not found' },
        { status: 404 }
      );
    }

    await prisma.trialBalance.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Trial balance entry deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete trial balance entry',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

