"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  apiGetProducts,
  // apiGetCategories,
  ApiProduct,
  ApiCategory,
} from "@/lib/api"; // adjust import path

const FeaturedSection = () => {
  const t = useTranslations("featured");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await apiGetProducts();
      return res.data.filter((p) => p.isTopSell);
    },
  });

  // Fetch categories
  // const { data: categoriesData } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: async () => {
  //     const res = await apiGetCategories();
  //     return res.data;
  //   },
  // });

  // Map categoryId to category name
  // const getCategoryName = (categoryId: string) => {
  //   if (!categoriesData) return "";
  //   const category = categoriesData.find((c) => c.id === categoryId);
  //   return category ? category.translations[locale as "en" | "km"].name : "";
  // };
  function getTopSellLabel(isTopSell: boolean, locale: string) {
    if (!isTopSell) return ""; // or null if you want to hide it completely

    const labels = {
      en: "Top Sell",
      km: "ទំនិញលក់ល្អ",
    };

    return labels[locale as "en" | "km"] || labels.en;
  }

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  return (
    <section className="bg-white w-full py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
          <h2
            className={`text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              locale === "km" ? "font-hanuman" : ""
            }`}
          >
            {t("title")}
          </h2>
          <Link
            href={`/${locale}/products`}
            className={`bg-[#F9461C] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-300 hover:bg-[#d13a17] flex items-center gap-2 ${
              locale === "km" ? "font-hanuman" : ""
            }`}
          >
            {t("viewAll")}
            <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9461C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#F9461C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Products */}
          <div
            ref={containerRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading products</p>}
            {productsData?.map((product) => (
              <div
                key={product.id}
                className="flex flex-col flex-shrink-0 w-64 sm:w-72 lg:w-80 snap-start"
              >
                <div className="card relative aspect-square mb-4 sm:mb-6 bg-white overflow-hidden rounded-[10px]">
                  <Image
                    src={product.images[0]}
                    alt={product.translations[locale as "en" | "km"].name}
                    fill
                    className="object-contain"
                  />
                  {getTopSellLabel(product.isTopSell, locale) && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-white text-[#F9461C] border border-[#F9461C]">
                      {getTopSellLabel(product.isTopSell, locale)}
                    </span>
                  )}

                  {/* <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-white text-[#F9461C] border border-[#F9461C]">
                    {getCategoryName(product.categoryId)}
                  </span> */}
                </div>
                <div className="flex flex-col flex-grow text-[#F9461C]">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={`font-bold text-lg sm:text-xl ${
                        locale === "km" ? "font-hanuman" : ""
                      }`}
                    >
                      {product.translations[locale as "en" | "km"].name}
                    </h3>
                    <span className="text-xs sm:text-sm font-bold opacity-75">
                      {product.translations[locale as "en" | "km"].size}
                    </span>
                  </div>
                  <p className="text-sm text-black mb-3 sm:mb-4 min-h-[48px]">
                    {product.translations[locale as "en" | "km"].description}
                  </p>
                  <Link
                    // href={`/${locale}/products/${product.slug}`}
                    href={`/${locale}/products`}
                    className="mt-auto w-full py-2.5 sm:py-3 px-6 sm:px-8 rounded-full font-bold text-sm border border-current hover:bg-[#F9461C] hover:text-white text-center"
                  >
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
