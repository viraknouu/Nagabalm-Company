"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  locale: string;
}

const ProtectedRoute = ({ children, locale }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for auth payload in localStorage (consistent with AuthWrapper)
        const authPayload = localStorage.getItem("authPayload");

        if (!authPayload) {
          console.log("No auth payload found, redirecting to login");
          setIsAuthorized(false);
          // Store the current path for redirect after login
          const currentPath = window.location.pathname;
          localStorage.setItem("redirectAfterLogin", currentPath);
          router.replace(`/${locale}/login`);
          return;
        }

        const parsedAuth = JSON.parse(authPayload);

        // Check if the auth payload has the expected structure
        if (!parsedAuth.success || !parsedAuth.data?.accessToken) {
          console.log("Invalid auth payload structure, redirecting to login");
          setIsAuthorized(false);
          localStorage.removeItem("authPayload");
          router.replace(`/${locale}/login`);
          return;
        }

        // Check if token is expired
        const token = parsedAuth.data.accessToken;
        if (isTokenExpired(token)) {
          console.log("Token expired, redirecting to login");
          setIsAuthorized(false);
          localStorage.removeItem("authPayload");
          router.replace(`/${locale}/login`);
          return;
        }

        console.log("User authenticated successfully");
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthorized(false);
        localStorage.removeItem("authPayload");
        router.replace(`/${locale}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router, locale]);

  // Function to check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // If we can't parse it, consider it expired
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
