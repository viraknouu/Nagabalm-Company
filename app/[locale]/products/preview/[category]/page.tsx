"use client";

import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useCallback } from "react";

// Types for API response
type ApiProductTranslation = {
  name: string;
  description?: string;
  size?: string;
  activeIngredient?: string;
  usage?: string[];
  bestForTags?: string[];
};

type ApiProduct = {
  id: string;
  slug: string;
  images: string[];
  price?: number;
  isTopSell?: boolean;
  translations: {
    en: ApiProductTranslation;
    km?: ApiProductTranslation;
    [key: string]: ApiProductTranslation | undefined;
  };
};

type CategoryApiResponse = {
  success: boolean;
  data: {
    id: string;
    slug: string;
    translations: {
      en: { name: string };
      km?: { name: string };
      [key: string]: { name: string } | undefined;
    };
    products: ApiProduct[];
  };
};

const categoryStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-[#F9461C]", text: "text-white" },
  balms: { bg: "bg-[#00B388]", text: "text-white" },
};

// const categoryTitles: Record<string, string> = {
//   active: "",
//   balms: "",
// };

// Local image fallback (if needed)
const fallbackImage = "/images/placeholder.png";

// No translation key mapping needed for API-driven products
const PRODUCT_DETAIL_KEYS: Record<string, string> = {} as const;

// ProductModal component
type ProductModalProps = { product: ApiProduct; onClose: () => void };
const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const t = useTranslations("products.preview.modal");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  if (!product) return null;

  // Get translated product details for modal from API product
  const getModalProductDetails = useCallback(() => {
    const tr = product.translations[locale] || product.translations.en;
    const name = tr?.name || product.slug || "PRODUCT";
    const description = tr?.description || "";
    return {
      name: name.toUpperCase(),
      description,
      activeIngredient: tr?.activeIngredient || "",
      usage: tr?.usage || [],
      tags: tr?.bestForTags || [],
    };
  }, [product.translations, product.slug, locale]);

  const modalDetails = getModalProductDetails();

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white max-w-4xl w-full rounded-xl overflow-hidden max-h-[90vh] relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#F9461C] text-3xl font-bold hover:scale-110 transition-transform z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col lg:flex-row p-8 gap-8 overflow-y-auto lg:p-10 max-h-[90vh]">
          <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-xl p-6">
            <div className="relative w-80 h-80">
              <Image
                src={product.images?.[0] || fallbackImage}
                alt={modalDetails.name}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="flex-1 p-2 md:p-4 lg:p-6 flex flex-col gap-6">
            <h2 className="text-[#F9461C] text-3xl font-extrabold leading-tight">
              {modalDetails.name}
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {modalDetails.description}
            </p>
            <div className="bg-[#B2E3D7] p-6 rounded-xl">
              <h3 className="font-bold mb-2 text-[#009688]">
                {t("activeIngredient")}
              </h3>
              <p className="text-gray-800">{modalDetails.activeIngredient}</p>
            </div>
            <div className="bg-[#FFE6B0] p-6 rounded-xl">
              <h3 className="font-bold mb-2 text-[#F9461C]">{t("usage")}</h3>
              <p className="whitespace-pre-line text-gray-800">
                {Array.isArray(modalDetails.usage)
                  ? modalDetails.usage.join("\n")
                  : modalDetails.usage}
              </p>
            </div>
            <div className="flex flex-wrap p-2 md:p-4 gap-3">
              {Array.isArray(modalDetails.tags) &&
                modalDetails.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-[#B2E3D7] text-[#009688] px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("products.preview");
  const tCategories = useTranslations("products.preview.categories");
  const locale = (params.locale as string) || "en";

  const category = params.category as "active" | "balms";
  const style = categoryStyles[category] || {
    bg: "bg-gray-200",
    text: "text-black",
  };
  // Title will be set from the API category name once loaded. Initialize empty to avoid missing translation keys.
  const [title, setTitle] = useState<string>("");

  // Dynamic products from API
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    const fetchCategory = async () => {
      try {
        // Map preview route to API category IDs
        const CATEGORY_ID_BY_ROUTE: Record<"active" | "balms", string> = {
          active: "68acfbfdbe8664e3f42886aa", // Inhalers
          balms: "68ab34eefe336d92f6207bcf", // Balms
        };
        const categoryId =
          CATEGORY_ID_BY_ROUTE[category] || CATEGORY_ID_BY_ROUTE.active;
        const res = await fetch(`/api/categories/${categoryId}`);
        const json: CategoryApiResponse = await res.json();
        if (!json?.success) throw new Error("Failed to load category");
        if (!isMounted) return;
        const apiProducts = json.data.products || [];
        setProducts(apiProducts);
        const apiTitle =
          json.data.translations?.[locale]?.name ||
          json.data.translations?.en?.name ||
          "Products";
        setTitle(apiTitle);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCategory();
    return () => {
      isMounted = false;
    };
  }, [locale, category]);

  const categories = ["active", "balms"];
  const currentIndex = categories.indexOf(category);
  const prevCategory = categories[
    (currentIndex - 1 + categories.length) % categories.length
  ] as "active" | "balms";
  const nextCategory = categories[(currentIndex + 1) % categories.length] as
    | "active"
    | "balms";

  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null
  );

  // Build translated product details directly from API product
  const getTranslatedProductDetails = useCallback(
    (product: ApiProduct) => {
      const tr = product.translations[locale] || product.translations.en;
      return {
        name: (tr?.name || product.slug || "PRODUCT").toUpperCase(),
        desc: tr?.description || "",
        weight: tr?.size || "",
      };
    },
    [locale]
  );

  return (
    <div
      className={`min-h-screen w-full ${style.bg} ${style.text} flex flex-col items-center justify-center pb-16 px-0 relative`}
    >
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#F9461C]/30 via-[#00B388]/20 to-white/80 pointer-events-none" />

      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-8 relative z-10">
        <Image
          src="/images/Logo/Naga Balm__Brandmark_White.png"
          alt="Naga Balm Logo"
          width={90}
          height={90}
          className="drop-shadow-lg mb-4"
        />
        <h1
          className="text-4xl md:text-6xl font-extrabold mb-2 text-center tracking-tight drop-shadow-lg text-white"
          style={{ textShadow: "0 2px 16px #F9461C55" }}
        >
          {t("hero.productsTitle", { category: title })}
        </h1>
        <div className="h-2 w-24 bg-gradient-to-r from-[#F9461C] to-[#00B388] rounded-full mb-4" />
        <p className="text-lg text-white/90 max-w-2xl text-center mb-2">
          {t("hero.subtitle", { category: title.toLowerCase() })}
        </p>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => router.push(`/products/preview/${prevCategory}`)}
        className="fixed left-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#F9461C] rounded-full p-3 shadow hover:bg-white z-50 border-2 border-[#F9461C] hover:scale-110 transition-transform"
        aria-label={t("navigation.goToPrevious", {
          category: tCategories(prevCategory),
        })}
      >
        <span className="text-3xl">&#8592;</span>
      </button>
      <button
        onClick={() => router.push(`/products/preview/${nextCategory}`)}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#F9461C] rounded-full p-3 shadow hover:bg-white z-50 border-2 border-[#F9461C] hover:scale-110 transition-transform"
        aria-label={t("navigation.goToNext", {
          category: tCategories(nextCategory),
        })}
      >
        <span className="text-3xl">&#8594;</span>
      </button>
      <button
        onClick={() => router.push("/products")}
        className="absolute top-8 left-8 bg-white text-[#F9461C] font-bold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors z-20 border border-[#F9461C]"
      >
        {t("navigation.backToProducts")}
      </button>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full max-w-7xl px-4 z-10">
        {loading && (
          <div className="col-span-full text-center text-white/90">
            Loading...
          </div>
        )}
        {!loading &&
          products.map((product) => {
            const details = getTranslatedProductDetails(product);
            return (
              <div
                key={product.id}
                className="bg-white/90 card shadow-xl p-4 flex flex-col h-[500px] rounded-2xl border border-[#F9461C]/10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative background blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#F9461C]/10 to-[#00B388]/10 rounded-full blur-2xl z-0 group-hover:scale-110 transition-transform duration-300" />

                {/* Product Image Area */}
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl z-10 flex items-center justify-center bg-white/60">
                  <Image
                    src={product.images?.[0] || fallbackImage}
                    alt={details.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col flex-grow z-10">
                  <div className="text-[#F9461C] font-extrabold text-base mb-1 text-center min-h-[48px] flex items-center justify-center">
                    {details.name}
                  </div>
                  <div className="text-black text-xs mb-2 text-center overflow-hidden h-16">
                    {details.desc}
                  </div>
                  <div className="mt-auto">
                    <div className="text-xs text-right w-full text-gray-500 mb-4">
                      {details.weight}
                    </div>
                    <button
                      className="border-2 border-[#F9461C] text-[#F9461C] font-bold py-2 px-6 rounded-full text-sm transition-colors hover:bg-[#F9461C] hover:text-white w-full"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {t("modal.learnMore")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
