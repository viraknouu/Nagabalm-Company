// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get product by ID
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

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
        error: "Failed to fetch product",
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
    const { slug, images, price, isTopSell, translations, categoryId } = body;

    // Validate required fields
    if (
      !slug ||
      !images ||
      price === undefined ||
      isTopSell === undefined ||
      !translations ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: slug, image, price, isTopSell, translations, categoryId",
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
      if (!trans.name || !trans.description) {
        return NextResponse.json(
          {
            success: false,
            error: `Translation for '${lang}' must have 'name' and 'description' fields`,
          },
          { status: 400 }
        );
      }
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // Update product by ID
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        slug,
        images,
        price: parseFloat(price),
        isTopSell: Boolean(isTopSell),
        translations,
        categoryId, // 👈 now included
      },
    });
    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update product",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

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
        error: "Failed to update product",
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
    console.log("DELETE request received for ID:", id);

    // Check if product exists and get its data
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    console.log("Existing product found:", existingProduct ? "Yes" : "No");

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
          searchedId: id,
        },
        { status: 404 }
      );
    }

    // Delete product by ID
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    console.log("Product deleted successfully");

    return NextResponse.json({
      success: true,
      message: `Product deleted successfully`,
      deletedProduct: existingProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

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
        error: "Failed to delete product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
