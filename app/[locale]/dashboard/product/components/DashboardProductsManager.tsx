"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Pagination from "@/app/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

// Types
type Translation = {
  name: string;
  description: string;
  size?: string;
  activeIngredient?: string;
  usage?: string[];
  bestForTags?: string[];
};

type Product = {
  id: string;
  slug: string;
  images: string[];
  price: number;
  isTopSell: boolean;
  translations: { en: Translation; km: Translation };
  categoryId: string;
  createdAt?: string;
};

type Category = {
  id: string;
  slug: string;
  translations: { en: { name: string }; km: { name: string } };
};

const emptyTranslation = (): Translation => ({
  name: "",
  description: "",
  size: "",
  activeIngredient: "",
  usage: [],
  bestForTags: [],
});

const emptyProduct = (): Omit<Product, "id"> => ({
  slug: "",
  images: [],
  price: 0,
  isTopSell: false,
  translations: { en: emptyTranslation(), km: emptyTranslation() },
  categoryId: "",
});

// Helper chips input component
const ChipsInput: React.FC<{
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const addChip = useCallback(() => {
    const val = input.trim();
    if (!val) return;
    onChange([...(value || []), val]);
    setInput("");
  }, [input, onChange, value]);

  const removeChip = useCallback(
    (i: number) => onChange(value.filter((_, idx) => idx !== i)),
    [onChange, value]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(value || []).map((chip, i) => (
          <span
            key={i}
            className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {chip}
            <button
              type="button"
              className="text-red-500"
              onClick={() => removeChip(i)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-2 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || "Add item and press +"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
        />
        <button
          type="button"
          className="px-3 py-2 bg-gray-200 rounded"
          onClick={addChip}
        >
          +
        </button>
      </div>
    </div>
  );
};

const DashboardProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Modal/state for create/edit
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const pJson = await pRes.json();
      const cJson = await cRes.json();
      if (!pJson.success)
        throw new Error(pJson.error || "Failed to fetch products");
      if (!cJson.success)
        throw new Error(cJson.error || "Failed to fetch categories");
      setProducts(pJson.data || []);
      setCategories(cJson.data || []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Use pagination hook
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData: paginatedProducts,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: products,
    initialItemsPerPage: 12,
    searchQuery: query,
    searchFields: ["slug", "translations"] as (keyof Product)[],
  });

  const openCreate = useCallback(() => {
    setEditingId(null);
    setForm(emptyProduct());
    setOpen(true);
  }, []);

  const openEdit = useCallback((p: Product) => {
    setEditingId(p.id);
    const { id, ...rest } = p;
    setForm({ ...rest });
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  const handleUploadImages = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("images", f));
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Upload failed");
      const urls: string[] = json.data?.urls || [];
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
    } catch (e: any) {
      alert(e?.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  }, []);

  const saveProduct = useCallback(async () => {
    try {
      setSaving(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      await fetchAll();
      setOpen(false);
      // notify public page to refresh
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        new BroadcastChannel("products-updates").postMessage(
          "refresh-products"
        );
      }
    } catch (e: any) {
      alert(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [editingId, form, fetchAll]);

  const confirmDelete = useCallback((id: string) => setDeletingId(id), []);

  const deleteProduct = useCallback(async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/products/${deletingId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      await fetchAll();
      setDeletingId(null);
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        new BroadcastChannel("products-updates").postMessage(
          "refresh-products"
        );
      }
    } catch (e: any) {
      alert(e?.message || "Failed to delete");
    }
  }, [deletingId, fetchAll]);

  const removeImage = useCallback((idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Manage Products</div>
        <button
          onClick={openCreate}
          className="bg-[#F9461C] text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          New Product
        </button>
      </div>

      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by slug or name"
          className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button onClick={fetchAll} className="px-4 py-2 border rounded-lg">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">Loading…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <div className="relative w-full aspect-video bg-gray-50 rounded mb-3 overflow-hidden">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.slug}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="font-bold">
                {p.translations.en.name || p.slug}
              </div>
              <div className="text-sm text-gray-500">
                {p.translations.km.name}
              </div>
              <div className="mt-2 text-sm">
                ${p.price.toFixed(2)} {p.isTopSell ? " • Top" : ""}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-2 border rounded"
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-2 border rounded text-red-600"
                  onClick={() => confirmDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                {editingId ? "Edit Product" : "New Product"}
              </div>
              <button onClick={closeModal} className="text-2xl">
                ×
              </button>
            </div>

            {/* Basic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.translations?.en?.name || c.slug}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded px-3 py-2"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="topsell"
                  type="checkbox"
                  checked={form.isTopSell}
                  onChange={(e) =>
                    setForm({ ...form, isTopSell: e.target.checked })
                  }
                />
                <label htmlFor="topsell">Top Sell</label>
              </div>
            </div>

            {/* Images */}
            <div className="mt-4">
              <label className="block text-sm mb-2">Images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {(form.images || []).map((url, i) => (
                  <div
                    key={i}
                    className="relative w-28 h-28 bg-gray-50 rounded overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`img-${i}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/80 rounded px-1 text-red-600"
                      onClick={() => removeImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleUploadImages(e.target.files)}
                />
                {uploading && (
                  <span className="text-sm text-gray-500">Uploading…</span>
                )}
              </div>
            </div>

            {/* Translations */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(["en", "km"] as const).map((lng) => (
                <div key={lng} className="border rounded-lg p-4">
                  <div className="font-semibold mb-3">
                    {lng.toUpperCase()} Translation
                  </div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.translations[lng].name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: {
                            ...form.translations[lng],
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 mb-3"
                    rows={4}
                    value={form.translations[lng].description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: {
                            ...form.translations[lng],
                            description: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <label className="block text-sm mb-1">Size</label>
                  <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.translations[lng].size || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: {
                            ...form.translations[lng],
                            size: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  login
                  <label className="block text-sm mb-1">
                    Active Ingredientlogin
                  </label>
                  login
                  <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={form.translations[lng].activeIngredient || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: {
                            ...form.translations[lng],
                            activeIngredient: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <label className="block text-sm mb-1">Usage (bullets)</label>
                  <ChipsInput
                    value={form.translations[lng].usage || []}
                    onChange={(arr) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: { ...form.translations[lng], usage: arr },
                        },
                      })
                    }
                    placeholder="Add usage item"
                  />
                  <label className="block text-sm mb-1 mt-3">
                    Best For Tags
                  </label>
                  <ChipsInput
                    value={form.translations[lng].bestForTags || []}
                    onChange={(arr) =>
                      setForm({
                        ...form,
                        translations: {
                          ...form.translations,
                          [lng]: {
                            ...form.translations[lng],
                            bestForTags: arr,
                          },
                        },
                      })
                    }
                    placeholder="Add tag"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#F9461C] text-white rounded disabled:opacity-60"
                onClick={saveProduct}
                disabled={saving}
              >
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      {deletingId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-semibold mb-2">Delete Product</div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={deleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProductsManager;
