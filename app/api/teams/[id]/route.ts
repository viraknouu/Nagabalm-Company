import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/teams/[id] - Get single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Team member not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team member",
      },
      { status: 500 }
    );
  }
}

// PUT /api/teams/[id] - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { translations, image, categoryId } = body;

    // Generate slug from English name
    const slug = translations.en.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const teamMember = await prisma.teamMember.update({
      where: { id },
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
    console.error("Error updating team member:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update team member",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete team member",
      },
      { status: 500 }
    );
  }
}
