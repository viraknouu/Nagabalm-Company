"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

type Translation = {
  name: string;
  description: string;
  size?: string;
  activeIngredient?: string;
  usage?: string[];
  bestForTags?: string[];
};

export type ProductDto = {
  id: string;
  slug: string;
  images: string[];
  price: number;
  isTopSell: boolean;
  translations: { en: Translation; km: Translation };
  categoryId: string;
};

const DynamicProductsGridSection: React.FC = () => {
  const locale = useLocale() as "en" | "km";
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [bc, setBc] = useState<BroadcastChannel | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      setProducts(json.data || []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Revalidate when page regains focus or visibility changes
    const onFocus = () => fetchProducts();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchProducts();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    // Light polling for near real-time updates
    const interval = setInterval(fetchProducts, 30000);

    // BroadcastChannel for instant updates from dashboard
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("products-updates");
      setBc(channel);
      channel.onmessage = (event) => {
        if (event?.data === "refresh-products") {
          fetchProducts();
        }
      };
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, [fetchProducts]);

  // Re-filter when locale changes (no refetch necessary unless desired)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      (p.translations?.[locale]?.name || "").toLowerCase().includes(q) ||
      (p.translations?.[locale]?.description || "").toLowerCase().includes(q)
    );
  }, [products, query, locale]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="w-full py-12 flex justify-center items-center">
          <div className="animate-pulse text-[#F9461C] text-xl">Loading products…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="text-center text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "km" ? "ស្វែងរកផលិតផល…" : "Search products…"}
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {locale === "km" ? "មិនមានផលិតផល" : "No products found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const t = p.translations?.[locale] || p.translations.en;
              return (
                <article key={p.id} className="bg-white card shadow-lg rounded-lg p-4 sm:p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden rounded-lg bg-gray-50">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={t?.name || p.slug}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {locale === "km" ? "គ្មានរូបភាព" : "No image"}
                      </div>
                    )}
                    {p.isTopSell && (
                      <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#FFE6B0] text-[#F9461C]">
                        {locale === "km" ? "លក់ដាច់" : "Top Sell"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h3 className="text-[#F9461C] font-extrabold text-sm sm:text-base mb-2 sm:mb-3 text-center leading-tight px-2">
                      {t?.name}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 text-center line-clamp-4 px-2">
                      {t?.description}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="text-xs text-right text-gray-500 font-medium px-2">
                        {t?.size}
                      </div>
                      <div className="text-right text-[#F9461C] font-bold px-2">
                        {new Intl.NumberFormat(locale === "km" ? "km-KH" : "en-US", { style: "currency", currency: "USD" }).format(p.price)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicProductsGridSection;
