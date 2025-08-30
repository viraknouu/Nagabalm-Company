// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get category by ID
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);

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
        error: "Failed to fetch category",
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    // Update category by ID
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        slug,
        translations,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);

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
        error: "Failed to update category",
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
    console.log("DELETE request received for category ID:", id);

    // Check if category exists and get its data
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
    });

    console.log("Existing category found:", existingCategory ? "Yes" : "No");

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
          searchedId: id,
        },
        { status: 404 }
      );
    }

    // Check if category has products (we'll skip this check for now until relations work)
    // const productsCount = await prisma.product.count({
    //   where: { categoryId: id }
    // });
    // if (productsCount > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Cannot delete category with existing products",
    //       productCount: productsCount
    //     },
    //     { status: 400 }
    //   );
    // }

    // Delete category by ID
    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    console.log("Category deleted successfully");

    return NextResponse.json({
      success: true,
      message: `Category deleted successfully`,
      deletedCategory: existingCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);

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
        error: "Failed to delete category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
