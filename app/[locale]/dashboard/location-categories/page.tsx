"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import Pagination from "@/app/components/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateLocationCategory,
  apiDeleteLocationCategory,
  apiGetLocationCategories,
  apiUpdateLocationCategory,
  type ApiLocationCategory,
} from "@/lib/api";
import { postAppEvent } from "@/lib/events";
import { usePagination } from "@/hooks/usePagination";

interface LocationCategoryFormState {
  id?: string;
  slug: string;
  translations: {
    en: {
      name: string;
    };
    km: {
      name: string;
    };
  };
}

function emptyForm(): LocationCategoryFormState {
  return {
    slug: "",
    translations: {
      en: {
        name: "",
      },
      km: {
        name: "",
      },
    },
  };
}

export default function LocationCategoriesDashboardPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<LocationCategoryFormState>(emptyForm());
  const [search, setSearch] = useState("");

  const {
    data: locationCategoriesResp,
    isLoading: loadingLocationCategories,
    error: locationCategoriesError,
  } = useQuery({
    queryKey: ["location-categories"],
    queryFn: apiGetLocationCategories,
  });

  const locationCategories = locationCategoriesResp?.data ?? [];

  // Use pagination hook
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedLocationCategories,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: locationCategories,
    initialItemsPerPage: 10,
    searchQuery: search,
    searchFields: ["slug", "translations"] as (keyof ApiLocationCategory)[],
  });

  const createMutation = useMutation({
    mutationFn: async (
      payload: Omit<ApiLocationCategory, "id" | "createdAt" | "updatedAt">
    ) => {
      const res = await apiCreateLocationCategory(payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["location-categories"],
      });
      postAppEvent({ type: "location-categories/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error creating location category:", error);
      alert("Failed to create location category. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<ApiLocationCategory, "id" | "createdAt" | "updatedAt">;
    }) => {
      const res = await apiUpdateLocationCategory(id, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["location-categories"],
      });
      postAppEvent({ type: "location-categories/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error updating location category:", error);
      alert("Failed to update location category. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDeleteLocationCategory(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["location-categories"],
      });
      postAppEvent({ type: "location-categories/changed" });
    },
    onError: (error) => {
      console.error("Error deleting location category:", error);
      alert("Failed to delete location category. Please try again.");
    },
  });

  function openCreate() {
    setForm(emptyForm());
    setEditingId(undefined);
    setFormOpen(true);
  }

  function openEdit(c: ApiLocationCategory) {
    setForm({
      id: c.id,
      slug: c.slug,
      translations: {
        en: {
          name: c.translations.en.name || "",
        },
        km: {
          name: c.translations.km.name || "",
        },
      },
    });
    setEditingId(c.id);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const mainSlug = generateSlug(form.translations.en.name);

    const payload = {
      slug: mainSlug,
      translations: {
        en: { name: form.translations.en.name },
        km: { name: form.translations.km.name },
      },
    } as Omit<ApiLocationCategory, "id" | "createdAt" | "updatedAt">;

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const getFieldError = (field: string) => {
    switch (field) {
      case "en.name":
        return form.translations.en.name.trim() === ""
          ? "Location Category Name (English) is required"
          : "";
      case "km.name":
        return form.translations.km.name.trim() === ""
          ? "Location Category Name (Khmer) is required"
          : "";
      default:
        return "";
    }
  };

  const isFormValid = () => {
    return (
      form.translations.en.name.trim() !== "" &&
      form.translations.km.name.trim() !== ""
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Location Categories
          </h1>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            New Location Category
          </button>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location category name or slug..."
            className="w-full md:w-96 border rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {locationCategoriesError ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load location categories
              </h3>
              <p className="text-gray-600 mb-4">
                There was an error loading the location categories. Please try
                again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Location Category Name (English)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Location Category Name (Khmer)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Slug
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700 border-b text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingLocationCategories ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={5} className="px-4 py-6">
                        <div className="animate-pulse h-6 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedLocationCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No location categories found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {search.trim()
                            ? "No location categories match your search."
                            : "Get started by creating your first location category."}
                        </p>
                        {!search.trim() && (
                          <button
                            onClick={openCreate}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                          >
                            Create First Location Category
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLocationCategories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {c.translations.en.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {c.translations.km.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {c.slug}
                        </code>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 mr-2 transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this location category? This action cannot be undone."
                              )
                            )
                              deleteMutation.mutate(c.id);
                          }}
                          className="px-3 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loadingLocationCategories && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>

        {formOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="bg-white w-full max-w-sm sm:max-w-md md:max-w-2xl rounded-lg overflow-hidden max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-4 md:p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingId
                      ? "Edit Location Category"
                      : "Create Location Category"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                  {/* English Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Category Name (English) *
                    </label>
                    <input
                      type="text"
                      value={form.translations.en.name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          translations: {
                            ...f.translations,
                            en: { ...f.translations.en, name: e.target.value },
                          },
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none"
                      placeholder="Enter location category name in English"
                      required
                    />
                    {getFieldError("en.name") && (
                      <p className="text-black-500 text-sm mt-1">
                        {getFieldError("en.name")}
                      </p>
                    )}
                  </div>

                  {/* Khmer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Category Name (Khmer) *
                    </label>
                    <input
                      type="text"
                      value={form.translations.km.name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          translations: {
                            ...f.translations,
                            km: { ...f.translations.km, name: e.target.value },
                          },
                        }))
                      }
                      className="w-full border rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none"
                      placeholder="Enter location category name in Khmer"
                      required
                    />
                    {getFieldError("km.name") && (
                      <p className="text-black-500 text-sm mt-1">
                        {getFieldError("km.name")}
                      </p>
                    )}
                  </div>

                  {/* Auto-generated Slug Preview */}
                  {form.translations.en.name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Generated Slug (Auto)
                      </label>
                      <div className="bg-gray-100 px-3 py-2 rounded-md">
                        <code className="text-sm text-gray-600">
                          {generateSlug(form.translations.en.name)}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 md:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !isFormValid()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving
                      ? editingId
                        ? "Updating..."
                        : "Creating..."
                      : editingId
                      ? "Update Location Category"
                      : "Create Location Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
