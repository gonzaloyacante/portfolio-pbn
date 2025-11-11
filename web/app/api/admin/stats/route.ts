import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { requireAdmin, handleApiError } from '@/lib/server/auth';

// GET dashboard stats (admin only)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    // Parallel count queries - much faster than fetching all data
    const [
      totalProjects,
      publishedProjects,
      totalCategories,
      newContacts,
      totalContacts,
      totalSkills,
      totalSocialLinks,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'PUBLISHED' } }),
      prisma.projectCategory.count(),
      prisma.contact.count({ where: { status: 'NEW' } }),
      prisma.contact.count(),
      prisma.skill.count(),
      prisma.socialLink.count(),
    ]);

    return NextResponse.json({
      totalProjects,
      publishedProjects,
      totalCategories,
      newContacts,
      totalContacts,
      totalSkills,
      totalSocialLinks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
