import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('Refresh token endpoint hit');
    const body = await request.json();
    const { refreshToken } = body;

    console.log('Received refresh token:', refreshToken ? 'exists' : 'missing');

    if (!refreshToken) {
      console.error('No refresh token provided in request');
      return NextResponse.json(
        { success: false, error: "Missing refresh token" },
        { status: 400 }
      );
    }

    let decoded: jwt.JwtPayload;
    try {
      console.log('Verifying refresh token...');
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as jwt.JwtPayload;
      console.log('Token verified, user ID:', decoded.userId);
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Find the user and verify the provided refresh token matches the one in the database
    console.log('Looking up user in database...');
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Verify the refresh token matches
    if (user.refreshToken !== refreshToken) {
      console.error('Refresh token mismatch for user:', user.id);
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new JWTs
    console.log('Generating new tokens...');
    const newAccessToken = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // Access token expires in 15 minutes
    );

    const newRefreshToken = jwt.sign(
      { 
        userId: user.id,
        // Add a random value to ensure each refresh token is unique
        random: Math.random().toString(36).substring(2, 15)
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    // Update user with the new refresh token in the database
    console.log('Updating user with new refresh token...');
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          refreshToken: newRefreshToken,
          // Removed lastActiveAt as it's not in the schema
        },
      });
      console.log('Successfully updated user with new refresh token');
    } catch (error) {
      console.error('Failed to update user with new refresh token:', error);
      throw new Error('Failed to update user session');
    }

    console.log('Token refresh successful');
    return NextResponse.json(
      {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 900, // 15 minutes in seconds
        },
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error during token refresh:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh token. Please log in again.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}
