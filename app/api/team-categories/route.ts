import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/team-categories - Fetch all team categories
export async function GET() {
  try {
    const teamCategories = await prisma.teamCategory.findMany({
      include: {
        teamMembers: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: teamCategories,
    });
  } catch (error) {
    console.error("Error fetching team categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team categories",
      },
      { status: 500 }
    );
  }
}

// POST /api/team-categories - Create a new team category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { translations } = body;

    // Generate slug from English name
    const slug = translations.en.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const teamCategory = await prisma.teamCategory.create({
      data: {
        slug,
        translations,
      },
    });

    return NextResponse.json({
      success: true,
      data: teamCategory,
    });
  } catch (error) {
    console.error("Error creating team category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create team category",
      },
      { status: 500 }
    );
  }
}
