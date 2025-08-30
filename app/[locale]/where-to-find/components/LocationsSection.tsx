"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiGetLocations, apiGetLocationCategories } from "@/lib/api";

const LocationsSection = () => {
  const t = useTranslations("whereToFind.locations.categories");
  const locale = useLocale();

  // Fetch locations and categories from API
  const { data: locationsResp, isLoading: loadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: apiGetLocations,
  });

  const { data: locationCategoriesResp, isLoading: loadingCategories } =
    useQuery({
      queryKey: ["location-categories"],
      queryFn: apiGetLocationCategories,
    });

  const locations = locationsResp?.data ?? [];
  const locationCategories = locationCategoriesResp?.data ?? [];

  // Group locations by category
  const locationGroups = useMemo(() => {
    if (!locations.length || !locationCategories.length) return [];

    return locationCategories
      .map((category) => {
        const categoryLocations = locations.filter(
          (location) => location.categoryId === category.id
        );

        return {
          titleKey: category.slug,
          title:
            locale === "km"
              ? category.translations.km.name
              : category.translations.en.name,
          partners: categoryLocations.map((location) => ({
            name:
              locale === "km"
                ? location.translations.km.name
                : location.translations.en.name,
            logo: location.logo,
          })),
        };
      })
      .filter((group) => group.partners.length > 0); // Only show categories that have locations
  }, [locations, locationCategories, locale]);

  // Show loading state
  if (loadingLocations || loadingCategories) {
    return (
      <section className="w-full bg-white flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="animate-pulse space-y-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx}>
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="text-center py-5 sm:h-56 h-52">
                      <div className="flex justify-center border border-gray-200 p-3 h-[140px] sm:h-44 rounded-xl">
                        <div className="w-full h-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="py-1.5">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no locations
  if (!locationGroups.length) {
    return (
      <section className="w-full bg-white flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl text-center">
          <div className="text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No locations available
            </h3>
            <p className="text-gray-600">
              Locations will appear here once they are added to the system.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {locationGroups.map((group) => (
          <div key={group.titleKey} className="mb-10 sm:mb-14">
            <h3 className="text-[#F9461C] text-lg sm:text-xl font-extrabold mb-3 sm:mb-4 uppercase">
              {group.title}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-6 sm:gap-6">
              {group.partners.map((partner, i) => (
                <div key={i} className="text-center py-5 sm:h-56 h-52">
                  <div
                    className="flex justify-center border border-[#F9461C] p-3 h-[140px] sm:h-44 rounded-xl hover:scale-105 hover:shadow-lg transition-transform"
                    title={partner.name}
                  >
                    <div className="w-full flex items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={150}
                        height={150}
                        className="object-contain h-23 md:40 md:h-40 sm:rounded-md"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="py-1.5">
                    <span className="text-black text-md sm:text-md mt-5 leading-tight">
                      {partner.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LocationsSection;
