import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/team-categories/[id] - Get single team category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamCategory = await prisma.teamCategory.findUnique({
      where: { id },
      include: {
        teamMembers: true,
      },
    });

    if (!teamCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Team category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamCategory,
    });
  } catch (error) {
    console.error("Error fetching team category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team category",
      },
      { status: 500 }
    );
  }
}

// PUT /api/team-categories/[id] - Update team category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { translations } = body;

    // Generate slug from English name
    const slug = translations.en.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const teamCategory = await prisma.teamCategory.update({
      where: { id },
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
    console.error("Error updating team category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update team category",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/team-categories/[id] - Delete team category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if team category has team members
    const teamMembersCount = await prisma.teamMember.count({
      where: { categoryId: id },
    });

    if (teamMembersCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete team category with existing team members",
        },
        { status: 400 }
      );
    }

    await prisma.teamCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Team category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete team category",
      },
      { status: 500 }
    );
  }
}
