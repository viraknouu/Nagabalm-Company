// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(request: Request) {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

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
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, images, price, isTopSell, translations, categoryId } = body;

    // Validate required fields
    if (
      !slug ||
      !images ||
      !Array.isArray(images) ||
      price === undefined ||
      isTopSell === undefined ||
      !translations ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: slug, images, price, isTopSell, translations, categoryId",
        },
        { status: 400 }
      );
    }

    // Save product to DB
    const product = await prisma.product.create({
      data: {
        slug,
        images, // Expecting an array of URLs from the client
        price: parseFloat(price),
        isTopSell: Boolean(isTopSell),
        translations,
        categoryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

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
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
