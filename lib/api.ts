"use client";

import { getAccessToken } from "./auth";

// Environment-based configuration
const getApiBaseUrl = () => {
  // In browser, use relative URL (handled by Next.js rewrites in development)
  if (typeof window !== "undefined") return "";

  // In production, use Vercel's environment variable or fallback
  if (process.env.VERCEL_ENV === "production") {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://nagabalm.vercel.app"
    );
  }

  // In preview/staging environments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Default to local development
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

export interface TranslationFields {
  name: string;
  description: string;
  size?: string;
  activeIngredient?: string;
  usage?: string[];
  bestForTags?: string[];
  Slug?: string;
}

export interface ApiProduct {
  id: string;
  slug: string;
  images: string[];
  price: number;
  isNew: boolean;
  isTopSell: boolean;
  translations: {
    en: TranslationFields;
    km: TranslationFields;
  };
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  slug: string;
  translations: {
    en: { name: string };
    km: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiLocationCategory {
  id: string;
  slug: string;
  translations: {
    en: { name: string };
    km: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiLocation {
  id: string;
  slug: string;
  logo: string;
  translations: {
    en: { name: string };
    km: { name: string };
  };
  categoryId: string;
  category?: ApiLocationCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeamCategory {
  id: string;
  slug: string;
  translations: {
    en: { name: string };
    km: { name: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeamMember {
  id: string;
  slug: string;
  image: string;
  translations: {
    en: { name: string; role: string };
    km: { name: string; role: string };
  };
  categoryId: string;
  category?: ApiTeamCategory;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  // Prepend base URL if the URL is not absolute
  const fullUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  const res = await fetch(fullUrl, {
    ...init,
    headers: {
      "Content-Type":
        init?.body instanceof FormData
          ? (undefined as any)
          : "application/json",
      ...(init?.headers || {}),
      ...(shouldAttachAuth(init) ? authHeader() : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }
  return res.json();
}

function shouldAttachAuth(init?: RequestInit) {
  const method = (init?.method || "GET").toUpperCase();
  // Attach auth for non-GET or for upload endpoint
  return method !== "GET";
}

function authHeader() {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` } as Record<string, string>;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Products
export async function apiGetProducts() {
  return request<{ success: boolean; data: ApiProduct[]; count: number }>(
    `/api/products`
  );
}

export async function apiGetProduct(id: string) {
  return request<{ success: boolean; data: ApiProduct }>(`/api/products/${id}`);
}

export async function apiCreateProduct(
  payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiProduct }>(`/api/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateProduct(
  id: string,
  payload: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiProduct }>(
    `/api/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteProduct(id: string) {
  return request<{ success: boolean; message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

// Categories
export async function apiGetCategories() {
  return request<{ success: boolean; data: ApiCategory[]; count: number }>(
    `/api/categories`
  );
}

export async function apiGetCategory(id: string) {
  return request<{ success: boolean; data: ApiCategory }>(
    `/api/categories/${id}`
  );
}

export async function apiCreateCategory(
  payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiCategory }>(`/api/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateCategory(
  id: string,
  payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiCategory }>(
    `/api/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteCategory(id: string) {
  return request<{ success: boolean; message: string }>(
    `/api/categories/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Location Categories
export async function apiGetLocationCategories() {
  return request<{
    success: boolean;
    data: ApiLocationCategory[];
    count: number;
  }>(`/api/location-categories`);
}

export async function apiGetLocationCategory(id: string) {
  return request<{ success: boolean; data: ApiLocationCategory }>(
    `/api/location-categories/${id}`
  );
}

export async function apiCreateLocationCategory(
  payload: Omit<ApiLocationCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiLocationCategory }>(
    `/api/location-categories`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiUpdateLocationCategory(
  id: string,
  payload: Omit<ApiLocationCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiLocationCategory }>(
    `/api/location-categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteLocationCategory(id: string) {
  return request<{ success: boolean; message: string }>(
    `/api/location-categories/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Locations
export async function apiGetLocations() {
  return request<{ success: boolean; data: ApiLocation[]; count: number }>(
    `/api/locations`
  );
}

export async function apiGetLocation(id: string) {
  return request<{ success: boolean; data: ApiLocation }>(
    `/api/locations/${id}`
  );
}

export async function apiCreateLocation(
  payload: Omit<ApiLocation, "id" | "createdAt" | "updatedAt" | "category">
) {
  return request<{ success: boolean; data: ApiLocation }>(`/api/locations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateLocation(
  id: string,
  payload: Omit<ApiLocation, "id" | "createdAt" | "updatedAt" | "category">
) {
  return request<{ success: boolean; data: ApiLocation }>(
    `/api/locations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteLocation(id: string) {
  return request<{ success: boolean; message: string }>(
    `/api/locations/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Team Categories
export async function apiGetTeamCategories() {
  return request<{
    success: boolean;
    data: ApiTeamCategory[];
    count: number;
  }>(`/api/team-categories`);
}

export async function apiGetTeamCategory(id: string) {
  return request<{ success: boolean; data: ApiTeamCategory }>(
    `/api/team-categories/${id}`
  );
}

export async function apiCreateTeamCategory(
  payload: Omit<ApiTeamCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiTeamCategory }>(
    `/api/team-categories`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiUpdateTeamCategory(
  id: string,
  payload: Omit<ApiTeamCategory, "id" | "createdAt" | "updatedAt">
) {
  return request<{ success: boolean; data: ApiTeamCategory }>(
    `/api/team-categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteTeamCategory(id: string) {
  return request<{ success: boolean; message: string }>(
    `/api/team-categories/${id}`,
    {
      method: "DELETE",
    }
  );
}

// Team Members
export async function apiGetTeamMembers() {
  return request<{ success: boolean; data: ApiTeamMember[]; count: number }>(
    `/api/teams`
  );
}

export async function apiGetTeamMember(id: string) {
  return request<{ success: boolean; data: ApiTeamMember }>(`/api/teams/${id}`);
}

export async function apiCreateTeamMember(
  payload: Omit<ApiTeamMember, "id" | "createdAt" | "updatedAt" | "category">
) {
  return request<{ success: boolean; data: ApiTeamMember }>(`/api/teams`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateTeamMember(
  id: string,
  payload: Omit<ApiTeamMember, "id" | "createdAt" | "updatedAt" | "category">
) {
  return request<{ success: boolean; data: ApiTeamMember }>(
    `/api/teams/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteTeamMember(id: string) {
  return request<{ success: boolean; message: string }>(`/api/teams/${id}`, {
    method: "DELETE",
  });
}

// Upload
export async function apiUploadImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const res = await fetch(`/api/upload`, {
    method: "POST",
    body: formData,
    headers: {
      ...authHeader(),
    },
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error || `Upload failed: ${res.status}`);
  }
  return res.json() as Promise<{ success: boolean; data: { urls: string[] } }>;
}
