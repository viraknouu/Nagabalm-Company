"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

const ContactHeroSection = () => {
  const t = useTranslations('contact.hero');

  return (
    <section className="w-full bg-[#FFE2A9] flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Cloud decorations */}
      {/* Top-left cloud */}
      <div className="absolute top-0 left-0 w-40 md:w-72 h-[80px] md:h-[120px] z-10">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud left"
          fill
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {/* Top-right cloud (mirrored) */}
      <div className="absolute top-0 right-0 w-40 md:w-72 h-[80px] md:h-[120px] z-10">
        <Image
          src="/images/png/cloud-balm.avif"
          alt="Decorative cloud right"
          fill
          className="object-contain w-full h-full transform scale-x-[-1]"
          priority
        />
      </div>

      <div className="pt-32 z-10">
   <h1 
  className="text-[#F9461C] text-4xl sm:text-5xl font-extrabold leading-tight text-center mb-2 py-2 px-4"
>
  {t('title').split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index === 0 && <br />}
    </React.Fragment>
  ))}
</h1>
      </div>
    </section>
  );
};

export default ContactHeroSection;