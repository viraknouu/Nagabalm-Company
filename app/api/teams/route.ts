import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/teams - Fetch all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team members",
      },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { translations, image, categoryId } = body;

    // Generate slug from English name
    const slug = translations.en.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const teamMember = await prisma.teamMember.create({
      data: {
        slug,
        image,
        translations,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create team member",
      },
      { status: 500 }
    );
  }
}
