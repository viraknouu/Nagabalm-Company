"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getValidToken, getCurrentUser } from "@/lib/auth";
import { TokenPayload } from "@/lib/auth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Get a valid token (will refresh if needed)
        const token = await getValidToken();
        
        if (!token) {
          console.log("No valid token available, redirecting to login");
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            router.replace(`/${locale}/login`);
          }
          return;
        }

        // Verify we have a valid user
        const user = getCurrentUser();
        if (!user) {
          throw new Error('Invalid user data in token');
        }

        if (isMounted) {
          console.log("User authenticated successfully");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          // Clear all auth related data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("authPayload");
          router.replace(`/${locale}/login`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router, locale]);


  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Don't render anything while redirecting to login
    return null;
  }

  // Only render children when fully authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
