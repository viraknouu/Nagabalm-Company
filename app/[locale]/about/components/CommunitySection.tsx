"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const communityImages = [
  "/images/Our Community/DSC06940.jpg",
  "/images/Our Community/DSC06989.jpg",
  "/images/Our Community/DSC07244.jpg",
  "/images/Our Community/480448459_622762500697590_1060124915683718360_n.jpg",
  "/images/Our Community/476885815_619117524395421_1165404816787667151_n.jpg",
  "/images/about-grid/419002545_348958694744640_5701280740609446071_n.jpg",
  "/images/about-grid/430720496_388817580758751_2341257138742686116_n.jpg",
  "/images/Our Community/476321528_616791734628000_6020345715193527512_n.jpg",
  "/images/Our Community/462737742_8478493322234886_202929487404207175_n.jpg",
  "/images/Our Community/459147107_505390699101438_6388652628537632214_n.jpg",
  "/images/Our Community/459192999_505390715768103_7809267072028969117_n.jpg",
  "/images/Our Community/482193038_950912473882227_4785217563978755392_n.jpg",
];

export default function CommunitySection() {
  const t = useTranslations("about.community");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? communityImages.length - 1 : prev - 1
    );
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === communityImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full flex flex-col items-center py-12 sm:py-16 bg-white px-4 sm:px-6">
      {/* Title */}
      <h2 className="text-[#F9461C] text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-center">
        {t("title")}
      </h2>
      <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl">
        {t("subtitle")}
      </p>

      {/* Image Grid */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {communityImages.map((img, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === communityImages.length - 1;

            return (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`overflow-hidden rounded-lg shadow-md group transition-all duration-300 hover:shadow-xl aspect-square cursor-pointer ${
                  isFirst
                    ? "col-span-2 row-span-2"
                    : isLast
                    ? "col-span-2 row-span-2 md:col-start-5 md:row-start-2"
                    : ""
                }`}
              >
                <Image
                  src={img}
                  alt={`Naga Balm Community ${idx + 1}`}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2"
        >
          {/* Prev Button */}
          <button
            onClick={showPrev}
            className="absolute left-2 sm:left-4 text-white text-3xl sm:text-4xl font-bold p-2 sm:p-3 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60"
          >
            ‹
          </button>

          {/* Full Image */}
          <Image
            src={communityImages[currentIndex]}
            alt={`Full size ${currentIndex + 1}`}
            width={1200}
            height={900}
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 70vw"
            className="
              object-contain rounded-lg
              max-h-[70vh] max-w-full
              sm:max-h-[75vh] sm:max-w-[90%]
              md:max-h-[80vh] md:max-w-[80%]
              lg:max-h-[85vh] lg:max-w-[70%]
            "
            unoptimized
          />

          {/* Next Button */}
          <button
            onClick={showNext}
            className="absolute right-2 sm:right-4 text-white text-3xl sm:text-4xl font-bold p-2 sm:p-3 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60"
          >
            ›
          </button>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl font-bold p-2 sm:p-3 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
