"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormData } from "./validation";
import { z } from "zod";
import { setAuthTokens } from "@/lib/auth";
import api from "@/lib/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      setIsLoading(true);
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data?.success || !data.data?.accessToken || !data.data?.refreshToken) {
        setApiError("Login successful, but no tokens received. Please try again.");
        setIsLoading(false);
        return;
      }

// Clear any existing tokens first
localStorage.removeItem('authPayload');
setAuthTokens(data.data.accessToken, data.data.refreshToken);
localStorage.setItem("authPayload", JSON.stringify(data));

const redirectPath = localStorage.getItem("redirectAfterLogin") || `/${locale}/dashboard`;
localStorage.removeItem("redirectAfterLogin");
router.push(redirectPath);
},
onError: (error: Error) => {
setApiError(error.message || "An error occurred during login");
setIsLoading(false);
}
});
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setFormErrors({});

    // Validate form data with Zod
    try {
      const formData = loginSchema.parse({ email, password });
      loginMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<LoginFormData> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as keyof LoginFormData] = issue.message;
          }
        });
        setFormErrors(errors);
      } else {
        setApiError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {(apiError || formErrors.email || formErrors.password) && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md p-3">
            {apiError && <p>{apiError}</p>}
            {formErrors.email && <p>{formErrors.email}</p>}
            {formErrors.password && <p>{formErrors.password}</p>}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
               type="submit"
              disabled={isLoading}
               className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
          {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
