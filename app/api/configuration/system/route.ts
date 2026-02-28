import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const config = await prisma.systemConfiguration.findUnique({
      where: { tenantId: user.tenantId },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch system configuration' },
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

    const existing = await prisma.systemConfiguration.findUnique({
      where: { tenantId: user.tenantId },
    });

    let config;
    if (existing) {
      config = await prisma.systemConfiguration.update({
        where: { tenantId: user.tenantId },
        data: {
          groupReportingCurrency: data.groupReportingCurrency,
          gaap: data.gaap,
          epsCalc: data.epsCalc,
          numberFormat: data.numberFormat,
          decimalPlaces: parseInt(data.decimalPlaces) || 2,
          thousandSeparator: data.thousandSeparator,
          decimalSeparator: data.decimalSeparator,
          scale: data.scale,
          scaleShowIn: data.scaleShowIn || null,
          scaleSuffix: data.scaleSuffix || null,
          presentation: data.presentation,
          negativeNumberFormat: data.negativeNumberFormat,
          plugBs: data.plugBs,
          plugPl: data.plugPl,
          zeroDisplay: data.zeroDisplay,
          language: data.language,
        },
      });
    } else {
      config = await prisma.systemConfiguration.create({
        data: {
          tenantId: user.tenantId,
          groupReportingCurrency: data.groupReportingCurrency,
          gaap: data.gaap,
          epsCalc: data.epsCalc,
          numberFormat: data.numberFormat,
          decimalPlaces: parseInt(data.decimalPlaces) || 2,
          thousandSeparator: data.thousandSeparator,
          decimalSeparator: data.decimalSeparator,
          scale: data.scale,
          scaleShowIn: data.scaleShowIn || null,
          scaleSuffix: data.scaleSuffix || null,
          presentation: data.presentation,
          negativeNumberFormat: data.negativeNumberFormat,
          plugBs: data.plugBs,
          plugPl: data.plugPl,
          zeroDisplay: data.zeroDisplay,
          language: data.language,
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
      { success: false, error: 'Failed to save system configuration', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

