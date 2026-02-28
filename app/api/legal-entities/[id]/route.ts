import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const entity = await prisma.legalEntityMaster.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!entity) {
      return NextResponse.json(
        { success: false, error: 'Entity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      entity
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
        error: 'Failed to fetch entity',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    // Verify entity belongs to tenant
    const existingEntity = await prisma.legalEntityMaster.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!existingEntity) {
      return NextResponse.json(
        { success: false, error: 'Entity not found' },
        { status: 404 }
      );
    }

    // Convert percentage strings to decimals
    const entityData = {
      ...data,
      ownershipPercentDirect: data.ownershipPercentDirect ? parseFloat(data.ownershipPercentDirect) : null,
      ownershipPercentIndirect: data.ownershipPercentIndirect ? parseFloat(data.ownershipPercentIndirect) : null,
      totalOwnershipPercent: data.totalOwnershipPercent ? parseFloat(data.totalOwnershipPercent) : null,
      nciPercent: data.nciPercent ? parseFloat(data.nciPercent) : null,
      votingRightsPercent: data.votingRightsPercent ? parseFloat(data.votingRightsPercent) : null,
      consolidationPercent: data.consolidationPercent ? parseFloat(data.consolidationPercent) : null,
      acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : null,
      disposalDate: data.disposalDate ? new Date(data.disposalDate) : null,
    };

    const updatedEntity = await prisma.legalEntityMaster.update({
      where: { id: parseInt(id) },
      data: entityData
    });

    return NextResponse.json({
      success: true,
      entity: updatedEntity
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
        error: 'Failed to update entity',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify entity belongs to tenant before deleting
    const entity = await prisma.legalEntityMaster.findFirst({
      where: {
        id: parseInt(id),
        tenantId: user.tenantId
      }
    });

    if (!entity) {
      return NextResponse.json(
        { success: false, error: 'Entity not found' },
        { status: 404 }
      );
    }

    await prisma.legalEntityMaster.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Entity deleted successfully'
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
        error: 'Failed to delete entity',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

