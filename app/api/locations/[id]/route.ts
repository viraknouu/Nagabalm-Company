// app/api/locations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get location by ID with category
    const location = await prisma.location.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });

    if (!location) {
      return NextResponse.json(
        {
          success: false,
          error: "Location not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error fetching location:", error);

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
        error: "Failed to fetch location",
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
    const { slug, logo, translations, categoryId } = body;

    // Validate required fields
    if (!slug || !logo || !translations || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: slug, logo, translations, categoryId",
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

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id: id },
    });

    if (!existingLocation) {
      return NextResponse.json(
        {
          success: false,
          error: "Location not found",
        },
        { status: 404 }
      );
    }

    // Update location by ID
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        slug,
        logo,
        translations,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    if (!updatedLocation) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update location",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
      data: updatedLocation,
    });
  } catch (error) {
    console.error("Error updating location:", error);

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
        error: "Failed to update location",
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
    console.log("DELETE request received for location ID:", id);

    // Check if location exists and get its data
    const existingLocation = await prisma.location.findUnique({
      where: { id: id },
      include: {
        category: true,
      },
    });

    console.log("Existing location found:", existingLocation ? "Yes" : "No");

    if (!existingLocation) {
      return NextResponse.json(
        {
          success: false,
          error: "Location not found",
          searchedId: id,
        },
        { status: 404 }
      );
    }

    // Delete location by ID
    await prisma.location.delete({
      where: {
        id: id,
      },
    });

    console.log("Location deleted successfully");

    return NextResponse.json({
      success: true,
      message: `Location deleted successfully`,
      deletedLocation: existingLocation,
    });
  } catch (error) {
    console.error("Error deleting location:", error);

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
        error: "Failed to delete location",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
