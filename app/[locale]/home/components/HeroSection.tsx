"use client";

import React, { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const t = useTranslations("hero");
  const locale = useLocale();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadedData = () => setIsVideoLoaded(true);
    const handleCanPlayThrough = () => setIsVideoLoaded(true);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden">
      {/* Video Background with loading optimization */}
      <div className="absolute inset-0 w-full h-full">
        {/* Fallback gradient background while video loads */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          } bg-gradient-to-br from-orange-400 via-red-500 to-pink-500`}
        />
        {/* Optimized video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          loop
          preload="auto"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* WebM version for better performance in supported browsers */}
          <source src="/video/naga-balm.webm" type="video/webm" />
          {/* MP4 fallback */}
          <source src="/video/naga-balm.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Loading indicator */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm transition-opacity duration-500 ${
            isVideoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#F9461C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10 z-0" />
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 sm:pt-32 pb-8 sm:pb-12">
        <h1
          className={`text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-4 sm:mb-6 drop-shadow-lg transition-all duration-300 ${
            locale === "km" ? "font-hanuman" : ""
          }`}
        >
          {t("title")
            .split("\n")
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < t("title").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
        </h1>
        <p
          className={`text-white text-base sm:text-lg max-w-xs sm:max-w-md mb-6 sm:mb-8 drop-shadow-lg transition-all duration-300 ${
            locale === "km" ? "font-hanuman text-lg sm:text-xl" : ""
          }`}
        >
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link href={`/${locale}/products`}>
            <button
              className={`bg-[#F9461C] hover:bg-[#d13a17] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto text-center ${
                locale === "km" ? "font-hanuman" : ""
              }`}
            >
              {t("findRelief")}
            </button>
          </Link>
          <Link href={`/${locale}/about`}>
            <button
              className={`bg-[#FFE6B0] hover:bg-[#ffd580] text-[#F9461C] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto text-center ${
                locale === "km" ? "font-hanuman" : ""
              }`}
            >
              {t("learnMore")}
            </button>
          </Link>
        </div>
      </div>
      {/* Preload hint for video */}
      <link
        rel="preload"
        as="video"
        href="/video/naga-balm.webm"
        type="video/webm"
      />
    </div>
  );
};

export default HeroSection;
