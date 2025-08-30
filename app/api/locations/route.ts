// app/api/locations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get all locations with their categories
    const locations = await prisma.location.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);

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
          details:
            "Verify your MongoDB Atlas username, password, and network access settings.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch locations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    // Save location to DB
    const location = await prisma.location.create({
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

    return NextResponse.json(
      {
        success: true,
        message: "Location created successfully",
        data: location,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);

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
        error: "Failed to create location",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
