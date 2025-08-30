// app/api/location-categories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get location category by ID
    const locationCategory = await prisma.locationCategory.findUnique({
      where: {
        id: id,
      },
    });

    if (!locationCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Location category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: locationCategory,
    });
  } catch (error) {
    console.error("Error fetching location category:", error);

    // Check if it's a database connection error
    if (
      error instanceof Error &&
      error.message.includes("authentication failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database authentication failed. Please check your MongoDB credentials.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch location category",
        details: error instanceof Error ? error.message : "Unknown error",
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
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const { slug, translations } = body;

    // Validate required fields
    if (!slug || !translations) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: slug, translations",
        },
        { status: 400 }
      );
    }

    // Validate translations object structure
    if (typeof translations !== "object" || translations === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Translations must be an object",
        },
        { status: 400 }
      );
    }

    // Validate that translations has required language keys
    if (!translations.en || !translations.km) {
      return NextResponse.json(
        {
          success: false,
          error: "Translations must include both 'en' and 'km' language keys",
        },
        { status: 400 }
      );
    }

    // Validate each language translation structure
    for (const [lang, translation] of Object.entries(translations)) {
      if (typeof translation !== "object" || translation === null) {
        return NextResponse.json(
          {
            success: false,
            error: `Translation for '${lang}' must be an object`,
          },
          { status: 400 }
        );
      }

      const trans = translation as any;
      if (!trans.name) {
        return NextResponse.json(
          {
            success: false,
            error: `Translation for '${lang}' must have 'name' field`,
          },
          { status: 400 }
        );
      }
    }

    // Check if location category exists
    const existingLocationCategory = await prisma.locationCategory.findUnique({
      where: { id: id },
    });

    if (!existingLocationCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Location category not found",
        },
        { status: 404 }
      );
    }

    // Update location category by ID
    const updatedLocationCategory = await prisma.locationCategory.update({
      where: { id },
      data: {
        slug,
        translations,
      },
    });

    if (!updatedLocationCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update location category",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Location category updated successfully",
      data: updatedLocationCategory,
    });
  } catch (error) {
    console.error("Error updating location category:", error);

    // Check if it's a database connection error
    if (
      error instanceof Error &&
      error.message.includes("authentication failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database authentication failed. Please check your MongoDB credentials.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update location category",
        details: error instanceof Error ? error.message : "Unknown error",
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
    const { id } = await params;
    console.log("DELETE request received for location category ID:", id);

    // Check if location category exists and get its data
    const existingLocationCategory = await prisma.locationCategory.findUnique({
      where: { id: id },
    });

    console.log(
      "Existing location category found:",
      existingLocationCategory ? "Yes" : "No"
    );

    if (!existingLocationCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Location category not found",
          searchedId: id,
        },
        { status: 404 }
      );
    }

    // Delete location category by ID
    await prisma.locationCategory.delete({
      where: {
        id: id,
      },
    });

    console.log("Location category deleted successfully");

    return NextResponse.json({
      success: true,
      message: `Location category deleted successfully`,
      deletedLocationCategory: existingLocationCategory,
    });
  } catch (error) {
    console.error("Error deleting location category:", error);

    // Check if it's a database connection error
    if (
      error instanceof Error &&
      error.message.includes("authentication failed")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database authentication failed. Please check your MongoDB credentials.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete location category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
