import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { createContactSchema } from '@/lib/server/validation';
import { handleApiError } from '@/lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createContactSchema.parse(body);

    const contact = await prisma.contact.create({
      data: {
        ...data,
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        status: contact.status,
        createdAt: contact.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
