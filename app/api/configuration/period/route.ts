import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const config = await prisma.periodConfiguration.findUnique({
      where: { tenantId: user.tenantId },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch period configuration' },
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

    const existing = await prisma.periodConfiguration.findUnique({
      where: { tenantId: user.tenantId },
    });

    let config;
    if (existing) {
      config = await prisma.periodConfiguration.update({
        where: { tenantId: user.tenantId },
        data: {
          currentYearDate: data.currentYearDate ? new Date(data.currentYearDate) : null,
          previousYearDate: data.previousYearDate ? new Date(data.previousYearDate) : null,
          priorPeriodYearDate: data.priorPeriodYearDate ? new Date(data.priorPeriodYearDate) : null,
          fyStart: data.fyStart,
          numberOfPeriods: parseInt(data.numberOfPeriods) || 12,
          comparativePeriodsBs: data.comparativePeriodsBs,
          fiscalYearType: data.fiscalYearType,
          yearEndRule: data.yearEndRule || null,
        },
      });
    } else {
      config = await prisma.periodConfiguration.create({
        data: {
          tenantId: user.tenantId,
          currentYearDate: data.currentYearDate ? new Date(data.currentYearDate) : null,
          previousYearDate: data.previousYearDate ? new Date(data.previousYearDate) : null,
          priorPeriodYearDate: data.priorPeriodYearDate ? new Date(data.priorPeriodYearDate) : null,
          fyStart: data.fyStart,
          numberOfPeriods: parseInt(data.numberOfPeriods) || 12,
          comparativePeriodsBs: data.comparativePeriodsBs,
          fiscalYearType: data.fiscalYearType,
          yearEndRule: data.yearEndRule || null,
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
      { success: false, error: 'Failed to save period configuration', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

