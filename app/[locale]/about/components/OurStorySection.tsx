"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const OurStorySection = () => {
  const t = useTranslations("about.ourStory");

  return (
    <section
      id="our-story"
      className="
        relative w-full bg-[#D6F2F2]
        flex flex-col md:flex-row
        items-center justify-center md:justify-between
        py-10 sm:py-14 md:py-20 lg:py-24
        px-4 sm:px-6 md:px-8 lg:px-16
        gap-6 sm:gap-8 md:gap-12
        overflow-hidden
      "
    >
      {/* Background Image (only desktop & up) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/images/about-grid/Mainposter.png"
          alt="Our Story Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div
        className="
          relative z-10
          flex-1 flex flex-col justify-center
          items-center md:items-start
          text-center md:text-left
          px-2 sm:px-4 md:px-0
          max-w-xl
          min-h-[50vh] sm:min-h-[45vh] md:min-h-[60vh]
        "
      >
        <h2
          className="
            text-[#F9461C]
            text-2xl sm:text-3xl md:text-[40px] lg:text-[64px]
            font-extrabold leading-tight
            mb-3 sm:mb-5 md:mb-6
          "
        >
          {t("title")}
        </h2>
        <p
          className="
            text-gray-700
            text-sm sm:text-base md:text-lg lg:text-[20px]
            leading-relaxed whitespace-pre-line
            max-w-prose
          "
        >
          {t("description")}
        </p>
      </div>
    </section>
  );
};

export default OurStorySection;
