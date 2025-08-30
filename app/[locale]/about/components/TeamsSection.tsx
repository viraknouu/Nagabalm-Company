"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetTeamMembers, apiGetTeamCategories } from "@/lib/api";
import { useParams } from "next/navigation";
import { subscribeAppEvents } from "@/lib/events";

const TeamsSection = () => {
  const t = useTranslations("about.teams");
  const [activeTab, setActiveTab] = useState(0);
  const params = useParams();
  const locale = params.locale as string;
  const queryClient = useQueryClient();

  // Fetch team members and categories
  const { data: teamMembersResp, isLoading: loadingTeamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: apiGetTeamMembers,
  });

  const { data: teamCategoriesResp, isLoading: loadingCategories } = useQuery({
    queryKey: ["team-categories"],
    queryFn: apiGetTeamCategories,
  });

  const teamMembers = teamMembersResp?.data ?? [];
  const teamCategories = teamCategoriesResp?.data ?? [];

  // Listen for team data changes and refresh
  useEffect(() => {
    const unsubscribe = subscribeAppEvents((event) => {
      if (
        event.type === "team-categories/changed" ||
        event.type === "team-members/changed"
      ) {
        queryClient.invalidateQueries({ queryKey: ["team-categories"] });
        queryClient.invalidateQueries({ queryKey: ["team-members"] });
      }
    });

    return unsubscribe;
  }, [queryClient]);

  // Group team members by category
  const teamGroups = useMemo(() => {
    if (!teamMembers.length || !teamCategories.length) return [];

    return teamCategories.map((category) => {
      const categoryMembers = teamMembers.filter(
        (member) => member.categoryId === category.id
      );

      return {
        label:
          locale === "km"
            ? category.translations.km.name
            : category.translations.en.name,
        members: categoryMembers.map((member) => ({
          name:
            locale === "km"
              ? member.translations.km.name
              : member.translations.en.name,
          role:
            locale === "km"
              ? member.translations.km.role
              : member.translations.en.role,
          img: member.image,
        })),
      };
    });
  }, [teamMembers, teamCategories, locale]);

  // Show loading state
  if (loadingTeamMembers || loadingCategories) {
    return (
      <section className="w-full flex flex-col items-center py-12 sm:py-16 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (teamGroups.length === 0) {
    return (
      <section className="w-full flex flex-col items-center py-12 sm:py-16 bg-white">
        <h2 className="text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-center px-4">
          {t("title")}
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl px-4">
          {t("subtitle")}
        </p>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No team members available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center py-12 sm:py-16 bg-white">
      <h2 className="text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-center px-4">
        {t("title")}
      </h2>
      <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl px-4">
        {t("subtitle")}
      </p>

      {/* Tabs */}
      <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
        {teamGroups.map((group, idx) => (
          <button
            key={group.label}
            className={`px-4 sm:px-6 py-2 rounded-full font-bold border-2 text-sm sm:text-base transition-colors duration-200 text-center ${
              activeTab === idx
                ? "bg-[#F9461C] text-white border-[#F9461C]"
                : "bg-white text-[#F9461C] border-[#F9461C]"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {teamGroups[activeTab]?.members.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 0 014 0zM7 10a2 2 0 11-4 0 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              No team members in this category yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Team members will appear here once they are added to this
              category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamGroups[activeTab]?.members.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Image wrapper */}
                <div className="relative w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-md">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <div className="text-[#F9461C] font-bold text-sm sm:text-base text-center">
                  {member.name}
                </div>

                {/* Role */}
                <div className="text-gray-700 text-xs sm:text-sm text-center">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamsSection;
