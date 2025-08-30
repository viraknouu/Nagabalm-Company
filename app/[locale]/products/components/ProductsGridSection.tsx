"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetProducts, apiGetCategories, type ApiProduct } from "@/lib/api";
import { subscribeAppEvents } from "@/lib/events";

// Types
interface DisplayProduct {
  id: string;
  name: string;
  desc: string;
  img: string;
  weight?: string;
  badge: string | null;
  label: string | null;
}

type CategoryItem = {
  id: string;
  name?: string;
  translations?: Record<string, { name?: string }>;
};

// Helper to get background class based on product name
const getProductBgClass = (name: string): string => {
  const upper = name.toUpperCase();
  if (upper.includes("ORIGINAL")) return "bg-yellow-100";
  if (upper.includes("ICE")) return "bg-blue-100";
  if (upper.includes("FIRE")) return "bg-red-100";
  if (upper.includes("GO")) return "bg-green-100";
  if (upper.includes("ENERGIZING")) return "bg-teal-100";
  return "bg-gray-100";
};

// Components
const LoadingSpinner: React.FC = () => {
  const t = useTranslations("products.grid.states");
  return (
    <div className="w-full py-12 flex justify-center items-center">
      <div className="animate-pulse text-[#F9461C] text-xl">
        {t("loadingProducts")}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  const t = useTranslations("products.grid.states");
  return (
    <div className="col-span-full text-center py-12">
      <div className="text-gray-400 text-lg mb-2">{t("noProductsFound")}</div>
      <div className="text-gray-500 text-sm">{t("tryAdjusting")}</div>
    </div>
  );
};

const ProductBadge: React.FC<{
  badge: string;
  position: "left" | "right";
  isNew?: boolean;
}> = ({ badge, position, isNew }) => {
  const baseClasses =
    "absolute top-4 text-xs font-bold px-3 py-1 rounded-full z-10";
  const positionClasses = position === "left" ? "left-4" : "right-4";
  const colorClasses = isNew
    ? "bg-[#FFE6B0] text-[#F9461C]"
    : "bg-[#B2E3D7] text-[#009688]";

  return (
    <span className={`${baseClasses} ${positionClasses} ${colorClasses}`}>
      {badge}
    </span>
  );
};

const ProductCard: React.FC<{
  product: DisplayProduct;
  onLearnMore: (productId: string) => void;
}> = React.memo(({ product, onLearnMore }) => {
  const t = useTranslations("products.grid.actions");
  const handleLearnMore = useCallback(() => {
    onLearnMore(product.id);
  }, [product.id, onLearnMore]);

  const bgClass = getProductBgClass(product.name);

  return (
    <article className="bg-white card shadow-lg rounded-lg p-4 sm:p-6 flex flex-col h-auto min-h-[450px] sm:min-h-[500px] lg:h-[520px] hover:shadow-xl transition-shadow duration-300">
      <div
        className={`relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden rounded-lg ${bgClass}`} // use ${bgClass} to apply background class dynamically it depends on the client's desire
      >
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />
        {product.label && (
          <ProductBadge badge={product.label} position="left" />
        )}
        {product.badge && (
          <ProductBadge badge={product.badge} position="right" isNew />
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-[#F9461C] font-extrabold text-sm sm:text-base mb-2 sm:mb-3 text-center min-h-[40px] sm:min-h-[48px] flex items-center justify-center leading-tight px-2">
          {product.name}
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 text-center line-clamp-3 sm:line-clamp-4 flex-grow px-2">
          {product.desc}
        </p>
        <div className="mt-auto space-y-3 sm:space-y-4">
          {product.weight && (
            <div className="text-xs text-right text-gray-500 font-medium px-2">
              {product.weight}
            </div>
          )}
          <button
            className="w-full border-2 border-[#F9461C] text-[#F9461C] font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-xs sm:text-sm transition-all duration-300 hover:bg-[#F9461C] hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F9461C] focus:ring-opacity-50"
            onClick={handleLearnMore}
            aria-label={`Learn more about ${product.name}`}
          >
            {t("learnMore")}
          </button>
        </div>
      </div>
    </article>
  );
});
ProductCard.displayName = "ProductCard";

const ProductModal: React.FC<{
  product: ApiProduct;
  onClose: () => void;
}> = React.memo(({ product, onClose }) => {
  const t = useTranslations("products.grid");
  const locale = useLocale() as "en" | "km";
  const tr = product.translations[locale];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || ["/placeholder-logo.png"];
  const bgClass = getProductBgClass(tr.name || product.slug);

  useEffect(() => {
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

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white max-w-xs sm:max-w-2xl lg:max-w-4xl w-full rounded-xl overflow-hidden max-h-[90vh] relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 md:top-8 md:right-8 text-[#F9461C] text-3xl font-bold hover:scale-110 transition-transform z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={onClose}
          aria-label={t("actions.closeModal")}
        >
          ×
        </button>

        <div className="flex flex-col lg:flex-row p-4 sm:p-6 lg:p-10 gap-4 sm:gap-6 lg:gap-8 overflow-y-auto max-h-[90vh]">
          <div className="flex-1 flex flex-col gap-4">
            <div
              className={`flex justify-center items-center rounded-xl p-4 sm:p-6 ${bgClass}`}
            >
              <div className="relative w-full h-64 sm:h-80 aspect-square">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${tr.name} image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 ${
                      currentImageIndex === idx
                        ? "border-[#F9461C]"
                        : "border-gray-200"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${tr.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4 sm:gap-6 p-2 md:p-4 lg:p-6">
            {" "}
            {/* Added internal padding for right column */}
            <h2
              id="modal-title"
              className="text-[#F9461C] text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight"
            >
              {tr.name?.toUpperCase() || product.slug?.toUpperCase()}
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {tr.description}
            </p>
            <div className="bg-[#B2E3D7] p-4 sm:p-6 rounded-xl">
              <h3 className="font-bold mb-2 text-[#009688] text-sm sm:text-base">
                {t("modal.activeIngredient")}
              </h3>
              <p className="text-gray-800 text-sm sm:text-base">
                {tr.activeIngredient}
              </p>
            </div>
            <div className="bg-[#FFE6B0] p-4 sm:p-6 rounded-xl">
              <h3 className="font-bold mb-2 text-[#F9461C] text-sm sm:text-base">
                {t("modal.usage")}
              </h3>
              {Array.isArray(tr.usage) && tr.usage.length > 0 ? (
                <ul className="list-none text-gray-800 text-sm sm:text-base space-y-2">
                  {tr.usage.map((item, index) => (
                    <li key={index} className="flex items-start">
                      {/* <span className="text-green-600 mr-2">✔️</span> */}
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-800 text-sm sm:text-base">
                  {tr.usage || t("modal.noUsage")}
                </p>
              )}
            </div>
            {/* <div className="bg-[#FFE6B0] p-4 sm:p-6 rounded-xl">
              <h3 className="font-bold mb-2 text-[#F9461C] text-sm sm:text-base">
                {t("modal.usage")}
              </h3>
              <p className="whitespace-pre-line text-gray-800 text-sm sm:text-base">
                {tr.usage}
              </p>
            </div> */}
            {Array.isArray(tr.bestForTags) && tr.bestForTags.length > 0 && (
              <div className="flex flex-wrap gap-3 md:gap-5 lg:gap-6 mt-4 md:mt-6 p-2 md:p-4">
                {" "}
                {/* Added padding to tags container */}
                {tr.bestForTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="bg-[#B2E3D7] text-[#009688] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductModal.displayName = "ProductModal";
// const ProductModal: React.FC<{
//   product: ApiProduct;
//   onClose: () => void;
// }> = React.memo(({ product, onClose }) => {
//   const t = useTranslations("products.grid");
//   const locale = useLocale() as "en" | "km";
//   const tr = product.translations[locale];
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const images = product.images || ["/placeholder-logo.png"];
//   const bgClass = getProductBgClass(tr.name || product.slug);

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handleEscape);
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [onClose]);

//   const handleBackdropClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === e.currentTarget) onClose();
//     },
//     [onClose]
//   );

//   const nextImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   }, [images.length]);

//   const prevImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   }, [images.length]);

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//       onClick={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
//       <div
//         className="bg-white max-w-xs sm:max-w-2xl lg:max-w-4xl w-full rounded-xl overflow-hidden max-h-[90vh] relative shadow-2xl animate-in fade-in zoom-in duration-200"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-4 right-4 text-[#F9461C] text-3xl font-bold hover:scale-110 transition-transform z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
//           onClick={onClose}
//           aria-label={t("actions.closeModal")}
//         >
//           ×
//         </button>

//         <div className="flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 overflow-y-auto max-h-[90vh]">
//           <div className="flex-1 flex flex-col gap-4">
//             <div
//               className={`flex justify-center items-center rounded-xl p-4 sm:p-6 ${bgClass}`}
//             >
//               <div className="relative w-full h-64 sm:h-80 aspect-square">
//                 <Image
//                   src={images[currentImageIndex]}
//                   alt={`${tr.name} image ${currentImageIndex + 1}`}
//                   fill
//                   className="object-contain" ////img full
//                   priority
//                 />
//                 {images.length > 1 && (
//                   <>
//                     <button
//                       onClick={prevImage}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//                       aria-label="Previous image"
//                     >
//                       ‹
//                     </button>
//                     <button
//                       onClick={nextImage}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//                       aria-label="Next image"
//                     >
//                       ›
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {images.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto py-2">
//                 {images.map((src, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImageIndex(idx)}
//                     className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 ${
//                       currentImageIndex === idx
//                         ? "border-[#F9461C]"
//                         : "border-gray-200"
//                     }`}
//                     aria-label={`View image ${idx + 1}`}
//                   >
//                     <Image
//                       src={src}
//                       alt={`${tr.name} thumbnail ${idx + 1}`}
//                       fill
//                       className="object-cover rounded-md"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex-1 flex flex-col gap-4 sm:gap-6">
//             <h2
//               id="modal-title"
//               className="text-[#F9461C] text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight"
//             >
//               {tr.name?.toUpperCase() || product.slug?.toUpperCase()}
//             </h2>

//             <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
//               {tr.description}
//             </p>

//             <div className="bg-[#B2E3D7] p-4 sm:p-6 rounded-xl">
//               <h3 className="font-bold mb-2 text-[#009688] text-sm sm:text-base">
//                 {t("modal.activeIngredient")}
//               </h3>
//               <p className="text-gray-800 text-sm sm:text-base">
//                 {tr.activeIngredient}
//               </p>
//             </div>

//             <div className="bg-[#FFE6B0] p-4 sm:p-6 rounded-xl">
//               <h3 className="font-bold mb-2 text-[#F9461C] text-sm sm:text-base">
//                 {t("modal.usage")}
//               </h3>
//               <p className="whitespace-pre-line text-gray-800 text-sm sm:text-base">
//                 {tr.usage}
//               </p>
//             </div>

//             {Array.isArray(tr.bestForTags) && tr.bestForTags.length > 0 && (
//               <div className="flex flex-wrap  sm:gap-3 gap-3 md:gap-5 lg:gap-6">
//                 {tr.bestForTags.map((tag: string, i: number) => (
//                   <span
//                     key={i}
//                     className="bg-[#B2E3D7] text-[#009688] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// ProductModal.displayName = "ProductModal";

// Main component
const ProductsGrid: React.FC = () => {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const t = useTranslations();
  const locale = useLocale() as "en" | "km";
  const queryClient = useQueryClient();

  // State
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  // Use TanStack Query to fetch products and categories
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery({
    queryKey: ["public-products"],
    queryFn: apiGetProducts,
    staleTime: 0,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: apiGetCategories,
    staleTime: 5 * 60 * 1000,
  });

  const allProducts = productsData?.data ?? [];
  const categories: CategoryItem[] = categoriesData?.data ?? [];

  // Map and filter products based on search and category
  const productsToDisplay = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.translations[locale]?.name
            ?.toLowerCase()
            .includes(normalizedQuery) ||
          p.translations[locale]?.description
            ?.toLowerCase()
            .includes(normalizedQuery)
      );
    }

    if (activeCategoryId !== "all") {
      result = result.filter((p) => p.categoryId === activeCategoryId);
    }

    return result.map((p) => {
      const tr = p.translations[locale];
      return {
        id: p.id,
        name: tr.name || p.slug,
        desc: tr.description || "",
        img: p.images?.[0] || "/placeholder-logo.png",
        weight: tr.size,
        badge: p.isNew ? (locale === "km" ? "ថ្មី" : "NEW") : null,
        label: p.isTopSell ? (locale === "km" ? "លក់ដាច់" : "TOP") : null,
      };
    });
  }, [allProducts, searchQuery, activeCategoryId, locale]);

  // Handlers
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);

  const handleLearnMore = useCallback((productId: string) => {
    setSelectedProductId(productId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Effects
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && categories.some((c) => c.id === urlCategory)) {
      setActiveCategoryId(urlCategory);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    const unsubscribe = subscribeAppEvents((evt) => {
      if (evt.type === "products/changed") {
        queryClient.invalidateQueries({ queryKey: ["public-products"] });
        refetch();
      }
    });
    return unsubscribe;
  }, [queryClient, refetch]);

  useEffect(() => {
    if (didMount.current && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const headerOffset = 100;
      const fullyVisible =
        rect.top >= headerOffset && rect.bottom <= window.innerHeight;
      if (!fullyVisible) {
        const y = rect.top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      didMount.current = true;
    }
  }, [activeCategoryId]);

  const selectedProduct = useMemo(() => {
    return allProducts.find((p) => p.id === selectedProductId);
  }, [allProducts, selectedProductId]);

  return (
    <section
      id="products-section"
      className="w-full py-8 sm:py-12 flex flex-col items-center bg-white"
      ref={gridRef}
    >
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}

      <div className="w-full max-w-7xl flex flex-col items-center mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9461C] mb-6 sm:mb-8">
          {t("products.grid.title")}
        </h2>

        {/* Filter and Search Section */}
        <div className="w-full mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t("products.grid.search.placeholder")}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F9461C] focus:ring-2 focus:ring-[#F9461C] focus:ring-opacity-20 transition-all duration-300 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#F9461C] transition-colors duration-200"
                  aria-label={t("products.grid.search.clear")}
                >
                  <svg
                    className="h-5 w-5"
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
              )}
            </div>
          </div>
          {/* Filter Products */}
          {/* Filter Products */}
          <div className="flex justify-center w-full">
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-2 rounded-2xl sm:rounded-full border border-gray-200 overflow-x-auto">
              {/* All Products Button */}
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 text-center whitespace-nowrap ${
                  activeCategoryId === "all"
                    ? "bg-[#F9461C] text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#F9461C] shadow-sm hover:shadow-md"
                }`}
                title={t("products.grid.filters.allProducts")}
              >
                {t("products.grid.filters.allProducts")}
              </button>

              {/* Categories */}
              {isLoadingCategories ? (
                <span className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-gray-500 font-bold text-xs sm:text-sm">
                  {t("products.grid.states.loadingProducts")}
                </span>
              ) : (
                categories.map((c) => {
                  const label =
                    c.translations?.[locale]?.name || c.name || c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 text-center whitespace-nowrap ${
                        activeCategoryId === c.id
                          ? "bg-[#F9461C] text-white shadow-lg scale-105"
                          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#F9461C] shadow-sm hover:shadow-md"
                      }`}
                      title={label}
                    >
                      {label.toUpperCase()}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-center">
            <div className="text-gray-600 text-sm">
              {t("products.grid.results.showing")}{" "}
              <span className="font-bold text-[#F9461C]">
                {productsToDisplay.length}
              </span>{" "}
              {t("products.grid.results.products")}
              {activeCategoryId !== "all" && (
                <span>
                  {" "}
                  {t("products.grid.results.in")}{" "}
                  <span className="font-medium text-[#F9461C]">
                    {categories.find((c) => c.id === activeCategoryId)
                      ?.translations?.[locale]?.name || activeCategoryId}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full">
          {isLoadingProducts ? (
            <LoadingSpinner />
          ) : productsToDisplay.length > 0 ? (
            productsToDisplay.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLearnMore={handleLearnMore}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
};

const ProductsGridSection: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsGrid />
    </Suspense>
  );
};

export default ProductsGridSection;
