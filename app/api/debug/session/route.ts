import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const user = await requireAuth();

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: {
        tenantId: user.tenantId
      }
    });

    return NextResponse.json({
      success: true,
      user: user,
      customerExists: !!customer,
      customerDetails: customer ? {
        email: customer.email,
        companyName: customer.companyName,
        tenantId: customer.tenantId,
        isActive: customer.isActive
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 });
  }
}

