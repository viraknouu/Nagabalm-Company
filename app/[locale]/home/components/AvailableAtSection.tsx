"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';

const partners = [
  { name: "7-Eleven", logo: "/images/partners/7-11.png" },
  { name: "Bonjour Mart", logo: "/images/partners/Total Bonjour Mart.png" },
  { name: "Aosot Plus", logo: "/images/partners/Aosot Plus.jpg" },
  { name: "Circle K", logo: "/images/partners/Circle K.png" },
  { name: "Super Duper", logo: "/images/partners/SuperDuper.png" },
  { name: "Point Sante", logo: "/images/partners/Point Sante Pharmacy.jpg" },
  { name: "21 Degree", logo: "/images/partners/21 Degree.jpg" },
];

const AvailableAtSection = () => {
  const t = useTranslations('availableAt');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-[#F9461C] text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 ${locale === 'km' ? 'font-hanuman' : ''}`}>
          {t('title')}
        </h2>
         <p className={`text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base ${locale === 'km' ? 'font-hanuman' : ''}`}>
          {t('subtitle')}
        </p>


        {/* Logo Carousel */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Logo Container */}
          <div
            ref={containerRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-hidden"
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 relative group"
              >
                <div className="absolute inset-0 bg-white rounded-lg transform transition-transform group-hover:scale-105">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain aspect-square p-2 sm:p-3 lg:p-4"
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Find Us Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link href={`/${locale}/where-to-find`}>
            <button className={`bg-[#F9461C] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:bg-[#d13a17] hover:scale-105 hover:shadow-lg ${locale === 'km' ? 'font-hanuman' : ''}`}>
              {t('findUsAt')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AvailableAtSection;
