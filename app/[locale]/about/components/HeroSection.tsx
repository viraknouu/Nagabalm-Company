"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const AboutHeroSection = () => {
  const t = useTranslations('about.hero');

  return (
    <section className="w-full bg-[#FFE6B0] min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh] flex flex-col lg:flex-row items-center justify-between py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
      
      {/* Cloud decorations */}
      <div className="absolute top-0 left-0 w-32 sm:w-40 md:w-48 lg:w-64 xl:w-80 h-[60px] sm:h-[80px] md:h-[100px] lg:h-[130px] xl:h-[160px] z-10">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud left"
          fill
          className="object-contain w-full h-full"
          priority
          sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 256px, 320px"
        />
      </div>

      <div className="absolute top-0 right-0 w-32 sm:w-40 md:w-48 lg:w-64 xl:w-80 h-[60px] sm:h-[80px] md:h-[100px] lg:h-[130px] xl:h-[160px] z-10">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud right"
          fill
          className="object-contain w-full h-full transform scale-x-[-1]"
          priority
          sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 256px, 320px"
        />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between h-full relative z-10">

        {/* Left side content */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start lg:pr-8 xl:pr-12 text-center lg:text-left order-2 lg:order-1 mt-6 lg:mt-0">
          <div className="w-full max-w-2xl">
            <h1 className="text-[#F9461C] text-[40px] sm:text-[38px] md:text-[50px] lg:text-[56px] xl:text-[62px] font-extrabold mb-4 sm:mb-6 md:mb-8 leading-tight whitespace-pre-line mt-4">
              {t('title')}
            </h1>
            <p className="text-gray-700 text-[18px] sm:text-[20px] mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('description')}
            </p>
            <Link href="#our-story">
              <button className="flex items-center justify-center gap-2 bg-[#F9461C] hover:bg-[#d13a17] text-white font-semibold py-3 px-6 sm:py-4 sm:px-10 rounded-full text-sm sm:text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ">
                {t("continueToStory")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-right"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Right side with the main logo */}
        <div className="flex-1 flex justify-center items-center relative order-1 lg:order-2 w-full lg:pl-4 xl:pl-8">
          <div className="flex-1 flex justify-center items-center relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[460px] order-2 md:order-1">
                    <Image
                      src="/images/Logo/NagaInFiredefr.png"
                      alt="Naga Logo"
                      width={400}
                      height={370}
                      className="relative z-20 object-contain w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] translate-y-[25%] sm:translate-y-[35%] md:translate-y-[45%] scale-[1.8] sm:scale-[2] md:scale-[2.2] lg:scale-[2.4]"
                    />
                  </div>
        </div>

      </div>
    </section>
  );
};

export default AboutHeroSection;
