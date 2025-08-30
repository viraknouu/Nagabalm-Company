import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n";
import { jwtVerify } from "jose";

const protectedApiRoutes = [
  "/api/products",
  "/api/users",
  "/api/upload",
  "/api/categories",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // Allow public GET access to products and categories
  const isProductsOrCategories =
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/categories");
  if (isProductsOrCategories && method === "GET") {
    // Skip auth for public reads
  } else {
    // Check if the route is a protected API route (all methods) or upload route
    const isProtectedApiRoute = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedApiRoute) {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { success: false, error: "Authorization token required" },
          { status: 401 }
        );
      }

      try {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET as string
        );
        await jwtVerify(token, secret);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    }
  }

  // Handle internationalization for all other routes
  const handleIntlRouting = createIntlMiddleware({
    locales,
    defaultLocale: "en",
    localePrefix: "always",
  });

  return handleIntlRouting(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/"],
};
