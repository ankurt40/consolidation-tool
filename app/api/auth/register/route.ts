import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, companyName } = await request.json();

    // Validation
    if (!email || !password || !companyName) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters long'
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered'
        },
        { status: 409 }
      );
    }

    // Generate unique tenant ID
    const tenantId = `tenant_${uuidv4()}`;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email,
        passwordHash,
        companyName,
        tenantId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        tenantId: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      customer: {
        id: customer.id,
        email: customer.email,
        companyName: customer.companyName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

