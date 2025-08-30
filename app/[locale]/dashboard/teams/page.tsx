"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import Pagination from "@/app/components/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiGetTeamMembers,
  apiGetTeamCategories,
  apiCreateTeamMember,
  apiUpdateTeamMember,
  apiDeleteTeamMember,
  apiUploadImages,
  type ApiTeamMember,
  type ApiTeamCategory,
} from "@/lib/api";
import { postAppEvent } from "@/lib/events";
import { usePagination } from "@/hooks/usePagination";
import Image from "next/image";

interface TeamMemberFormState {
  id?: string;
  slug: string;
  image: string;
  translations: {
    en: {
      name: string;
      role: string;
    };
    km: {
      name: string;
      role: string;
    };
  };
  categoryId: string;
}

function emptyForm(): TeamMemberFormState {
  return {
    slug: "",
    image: "",
    translations: {
      en: {
        name: "",
        role: "",
      },
      km: {
        name: "",
        role: "",
      },
    },
    categoryId: "",
  };
}

export default function TeamsDashboardPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<TeamMemberFormState>(emptyForm());
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    data: teamMembersResp,
    isLoading: loadingTeamMembers,
    error: teamMembersError,
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: apiGetTeamMembers,
  });

  const { data: teamCategoriesResp } = useQuery({
    queryKey: ["team-categories"],
    queryFn: apiGetTeamCategories,
  });

  const teamMembers = teamMembersResp?.data ?? [];
  const teamCategories = teamCategoriesResp?.data ?? [];

  // Use pagination hook
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedTeamMembers,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: teamMembers,
    initialItemsPerPage: 10,
    searchQuery: search,
    searchFields: ["translations", "slug"] as (keyof ApiTeamMember)[],
  });

  const createMutation = useMutation({
    mutationFn: async (
      payload: Omit<
        ApiTeamMember,
        "id" | "createdAt" | "updatedAt" | "category"
      >
    ) => {
      const res = await apiCreateTeamMember(payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["team-members"] });
      postAppEvent({ type: "team-members/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error creating team member:", error);
      alert("Failed to create team member. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<
        ApiTeamMember,
        "id" | "createdAt" | "updatedAt" | "category"
      >;
    }) => {
      const res = await apiUpdateTeamMember(id, payload);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["team-members"] });
      postAppEvent({ type: "team-members/changed" });
      setFormOpen(false);
      setForm(emptyForm());
      setEditingId(undefined);
    },
    onError: (error) => {
      console.error("Error updating team member:", error);
      alert("Failed to update team member. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiDeleteTeamMember(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["team-members"] });
      postAppEvent({ type: "team-members/changed" });
    },
    onError: (error) => {
      console.error("Error deleting team member:", error);
      alert("Failed to delete team member. Please try again.");
    },
  });

  function openCreate() {
    setForm(emptyForm());
    setEditingId(undefined);
    setFormOpen(true);
  }

  function openEdit(member: ApiTeamMember) {
    setForm({
      id: member.id,
      slug: member.slug,
      image: member.image,
      translations: {
        en: {
          name: member.translations.en.name || "",
          role: member.translations.en.role || "",
        },
        km: {
          name: member.translations.km.name || "",
          role: member.translations.km.role || "",
        },
      },
      categoryId: member.categoryId,
    });
    setEditingId(member.id);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const mainSlug = generateSlug(form.translations.en.name);

    const payload = {
      slug: mainSlug,
      image: form.image,
      translations: {
        en: {
          name: form.translations.en.name,
          role: form.translations.en.role,
        },
        km: {
          name: form.translations.km.name,
          role: form.translations.km.role,
        },
      },
      categoryId: form.categoryId,
    } as Omit<ApiTeamMember, "id" | "createdAt" | "updatedAt" | "category">;

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const selected = Array.from(files);
      const resp = await apiUploadImages(selected);
      const urls = resp.data.urls;
      if (urls.length > 0) {
        setForm((f) => ({ ...f, image: urls[0] }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setForm((f) => ({ ...f, image: "" }));
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
          ? "Team Member Name (English) is required"
          : "";
      case "km.name":
        return form.translations.km.name.trim() === ""
          ? "Team Member Name (Khmer) is required"
          : "";
      case "en.role":
        return form.translations.en.role.trim() === ""
          ? "Team Member Role (English) is required"
          : "";
      case "km.role":
        return form.translations.km.role.trim() === ""
          ? "Team Member Role (Khmer) is required"
          : "";
      case "categoryId":
        return form.categoryId.trim() === "" ? "Team Category is required" : "";
      default:
        return "";
    }
  };

  const isFormValid = () => {
    return (
      form.translations.en.name.trim() !== "" &&
      form.translations.km.name.trim() !== "" &&
      form.translations.en.role.trim() !== "" &&
      form.translations.km.role.trim() !== "" &&
      form.categoryId.trim() !== ""
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = teamCategories.find((c) => c.id === categoryId);
    return category ? category.translations.en.name : "Unknown Category";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            New Team Member
          </button>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team member name or role..."
            className="w-full md:w-96 border rounded-md px-3 py-2 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {teamMembersError ? (
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
                Failed to load team members
              </h3>
              <p className="text-gray-600 mb-4">
                There was an error loading the team members. Please try again.
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
                    Team Member
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Photo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    Category
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
                {loadingTeamMembers ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={6} className="px-4 py-6">
                        <div className="animate-pulse h-6 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedTeamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p className="text-lg font-medium mb-2">
                          No team members found
                        </p>
                        <p className="text-sm">
                          {search
                            ? "No team members match your search criteria."
                            : "Get started by creating your first team member."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTeamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div>
                          <div className="font-medium">
                            {member.translations.en.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {member.translations.km.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {member.image ? (
                          <div className="relative w-10 h-10">
                            <Image
                              src={member.image}
                              alt={member.translations.en.name}
                              fill
                              className="object-cover rounded-full"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div>
                          <div>{member.translations.en.role}</div>
                          <div className="text-gray-500 text-xs">
                            {member.translations.km.role}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {getCategoryName(member.categoryId)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(member)}
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
                                "Delete this team member? This action cannot be undone."
                              )
                            )
                              deleteMutation.mutate(member.id);
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
          {!loadingTeamMembers && totalPages > 1 && (
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
              className="bg-white w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl rounded-lg overflow-hidden max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-4 md:p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Team Member" : "Create New Team Member"}
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
                          <strong>Team Member Information:</strong> Create a new
                          team member with names and roles in both English and
                          Khmer languages. Upload a photo and assign to a team
                          category.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="team-member-name-en"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Team Member Name (English){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="team-member-name-en"
                        required
                        placeholder="e.g., John Doe"
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
                      {/* {getFieldError("en.name") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("en.name")}
                        </p>
                      )} */}
                    </div>
                    <div>
                      <label
                        htmlFor="team-member-name-kh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        ឈ្មោះសមាជិកក្រុម (ភាសាខ្មែរ){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="team-member-name-kh"
                        required
                        placeholder="ឧ. ចន ដូ"
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
                      {/* {getFieldError("km.name") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("km.name")}
                        </p>
                      )} */}
                    </div>

                    <div>
                      <label
                        htmlFor="team-member-role-en"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Role (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="team-member-role-en"
                        required
                        placeholder="e.g., CEO, Manager, Developer"
                        value={form.translations.en.role}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            translations: {
                              ...form.translations,
                              en: {
                                ...form.translations.en,
                                role: e.target.value,
                              },
                            },
                          })
                        }
                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base ${
                          getFieldError("en.role")
                            ? "border-black-500"
                            : "border-gray-200"
                        }`}
                      />
                      {/* {getFieldError("en.role") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("en.role")}
                        </p>
                      )} */}
                    </div>
                    <div>
                      <label
                        htmlFor="team-member-role-kh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        តួនាទី (ភាសាខ្មែរ){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="team-member-role-kh"
                        required
                        placeholder="ឧ. នាយកប្រតិបត្តិ, អ្នកគ្រប់គ្រង, អ្នកអភិវឌ្ឍន៍"
                        value={form.translations.km.role}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            translations: {
                              ...form.translations,
                              km: {
                                ...form.translations.km,
                                role: e.target.value,
                              },
                            },
                          })
                        }
                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base ${
                          getFieldError("km.role")
                            ? "border-black-500"
                            : "border-gray-200"
                        }`}
                      />
                      {/* {getFieldError("km.role") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("km.role")}
                        </p>
                      )} */}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="team-category"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Team Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="team-category"
                        required
                        value={form.categoryId}
                        onChange={(e) =>
                          setForm({ ...form, categoryId: e.target.value })
                        }
                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-orange-500 focus:outline-none text-sm sm:text-base ${
                          getFieldError("categoryId")
                            ? "border-black-500"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select a team category</option>
                        {teamCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.translations.en.name}
                          </option>
                        ))}
                      </select>
                      {/* {getFieldError("categoryId") && (
                        <p className="text-xs text-red-500 mt-1">
                          {getFieldError("categoryId")}
                        </p>
                      )} */}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Member Photo
                    </label>
                    <div className="space-y-4">
                      {form.image && (
                        <div className="relative inline-block">
                          <div className="relative w-24 h-24">
                            <Image
                              src={form.image}
                              alt="Team member photo"
                              fill
                              className="object-cover rounded-lg"
                              sizes="96px"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUpload(e.target.files)}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          disabled={uploading}
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500 mt-1">
                            Uploading image...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Generated Slug Preview:
                    </h3>
                    <p className="text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border">
                      {form.translations.en.name
                        ? generateSlug(form.translations.en.name)
                        : "team-member-slug-will-appear-here"}
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
                      disabled={saving || !isFormValid() || uploading}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Team Member"
                        : "Create Team Member"}
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
