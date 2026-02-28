import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const legalEntities = await prisma.legalEntityMaster.findMany({
      where: {
        tenantId: user.tenantId
      },
      orderBy: {
        leCode: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      legalEntities
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
        error: 'Failed to fetch legal entities',
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

    console.log('Creating legal entity for user:', user.email, 'with tenantId:', user.tenantId);

    // Check if tenantId is present in session
    if (!user.tenantId) {
      console.error('No tenantId in session for user:', user.email);
      return NextResponse.json(
        {
          success: false,
          error: 'Session error: No tenant ID found. Please log out and log back in.'
        },
        { status: 401 }
      );
    }

    // Verify the customer exists
    let customerExists = await prisma.customer.findUnique({
      where: {
        tenantId: user.tenantId
      }
    });

    // If customer doesn't exist but we have a tenantId, try to find by email
    if (!customerExists) {
      console.warn('Customer not found for tenantId:', user.tenantId, 'checking by email:', user.email);

      const customerByEmail = await prisma.customer.findUnique({
        where: {
          email: user.email
        }
      });

      if (customerByEmail) {
        console.log('Found customer by email with different tenantId:', customerByEmail.tenantId);
        return NextResponse.json(
          {
            success: false,
            error: 'Session mismatch detected. Please log out and log back in to refresh your session.'
          },
          { status: 401 }
        );
      }

      console.error('Customer not found at all for:', user.email);
      return NextResponse.json(
        {
          success: false,
          error: 'Your account was not found in the database. Please:\n1. Log out completely\n2. Close your browser\n3. Log back in with: demo@example.com / demo1234'
        },
        { status: 400 }
      );
    }

    console.log('Customer verified:', customerExists.email);

    // Convert percentage strings to decimals
    const entityData = {
      ...data,
      tenantId: user.tenantId,
      ownershipPercentDirect: data.ownershipPercentDirect ? parseFloat(data.ownershipPercentDirect) : null,
      ownershipPercentIndirect: data.ownershipPercentIndirect ? parseFloat(data.ownershipPercentIndirect) : null,
      totalOwnershipPercent: data.totalOwnershipPercent ? parseFloat(data.totalOwnershipPercent) : null,
      nciPercent: data.nciPercent ? parseFloat(data.nciPercent) : null,
      votingRightsPercent: data.votingRightsPercent ? parseFloat(data.votingRightsPercent) : null,
      consolidationPercent: data.consolidationPercent ? parseFloat(data.consolidationPercent) : null,
      acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : null,
      disposalDate: data.disposalDate ? new Date(data.disposalDate) : null,
    };

    console.log('Creating entity with leCode:', data.leCode);

    const newEntity = await prisma.legalEntityMaster.create({
      data: entityData
    });

    console.log('Legal entity created successfully:', newEntity.leCode);

    return NextResponse.json({
      success: true,
      entity: newEntity
    });
  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please log in again.'
        },
        { status: 401 }
      );
    }

    // Check for specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          {
            success: false,
            error: 'Database constraint error: Please log out completely, close your browser, and log back in.'
          },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          {
            success: false,
            error: 'A legal entity with this code already exists.'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create legal entity',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

