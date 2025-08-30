"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import Pagination from "@/app/components/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiGetCategories,
  apiUpdateCategory,
  type ApiCategory,
} from "@/lib/api";
import { postAppEvent } from "@/lib/events";
import { usePagination } from "@/hooks/usePagination";

interface CategoryFormState {
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

function emptyForm(): CategoryFormState {
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

export default function CategoriesDashboardPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<CategoryFormState>(emptyForm());
  const [search, setSearch] = useState("");

  const {
    data: categoriesResp,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: apiGetCategories,
  });

  const categories = categoriesResp?.data ?? [];

  // Use pagination hook
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedCategories,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: categories,
    initialItemsPerPage: 10,
    searchQuery: search,
    searchFields: ["slug", "translations"] as (keyof ApiCategory)[],
  });

  const createMutation = useMutation({
    mutationFn: async (
      payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">
    ) => {
      const res = await apiCreateCategory(payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      postAppEvent({ type: "categories/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<ApiCategory, "id" | "createdAt" | "updatedAt">;
    }) => {
      const res = await apiUpdateCategory(id, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      postAppEvent({ type: "categories/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDeleteCategory(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      postAppEvent({ type: "categories/changed" });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    },
  });

  function openCreate() {
    setForm(emptyForm());
    setEditingId(undefined);
    setFormOpen(true);
  }

  function openEdit(c: ApiCategory) {
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
    } as Omit<ApiCategory, "id" | "createdAt" | "updatedAt">;

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
          ? "Category Name (English) is required"
          : "";
      case "km.name":
        return form.translations.km.name.trim() === ""
          ? "Category Name (Khmer) is required"
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
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            New Category
          </button>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category name or slug..."
            className="w-full md:w-96 border rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {categoriesError ? (
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
                Failed to load categories
              </h3>
              <p className="text-gray-600 mb-4">
                There was an error loading the categories. Please try again.
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
                    Category Name (English)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Category Name (Khmer)
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
                {loadingCategories ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={5} className="px-4 py-6">
                        <div className="animate-pulse h-6 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedCategories.length === 0 ? (
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No categories found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {search.trim()
                            ? "No categories match your search."
                            : "Get started by creating your first category."}
                        </p>
                        {!search.trim() && (
                          <button
                            onClick={openCreate}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                          >
                            Create First Category
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((c) => (
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
                                "Delete this category? This action cannot be undone."
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
          {!loadingCategories && totalPages > 1 && (
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
                    {editingId ? "Edit Category" : "Create New Category"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6"
                style={{ maxHeight: "calc(95vh - 120px)" }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>Category Information:</strong> Create a new
                          category with names in both English and Khmer
                          languages. The slug will be automatically generated
                          from the English name.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="category-name-en"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Category Name (English){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="category-name-en"
                        required
                        placeholder="e.g., Pain Relief, Skincare"
                        value={form.translations.en.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            translations: {
                              ...form.translations,
                              en: {
                                ...form.translations.en,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base ${
                          getFieldError("en.name")
                            ? "border-black-500"
                            : "border-gray-200"
                        }`}
                      />
                      {getFieldError("en.name") && (
                        <p className="text-xs text-black-500 mt-1">
                          {getFieldError("en.name")}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        This will be the main category name displayed to
                        customers
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="category-name-kh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        ឈ្មោះប្រភេទ (ភាសាខ្មែរ){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="category-name-kh"
                        required
                        placeholder="ឧ. ថ្នាំបំបាត់ការឈឺចាប់, ថ្នាំថែរក្សាស្បែក"
                        value={form.translations.km.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            translations: {
                              ...form.translations,
                              km: {
                                ...form.translations.km,
                                name: e.target.value,
                              },
                            },
                          })
                        }
                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base ${
                          getFieldError("km.name")
                            ? "border-black-500"
                            : "border-gray-200"
                        }`}
                      />
                      {getFieldError("km.name") && (
                        <p className="text-xs text-black-500 mt-1">
                          {getFieldError("km.name")}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        នេះនឹងជាឈ្មោះប្រភេទចម្បងដែលបង្ហាញដល់អតិថិជន
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Generated Slug Preview:
                    </h3>
                    <p className="text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border">
                      {form.translations.en.name
                        ? generateSlug(form.translations.en.name)
                        : "category-slug-will-appear-here"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      This slug will be used in URLs and for internal
                      identification
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !isFormValid()}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Category"
                        : "Create Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
