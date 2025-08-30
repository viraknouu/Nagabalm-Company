import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

const DiscoverSolutionSection = () => {
  const t = useTranslations("contact.discoverSolution");
  const locale = useLocale();

  return (
    <section
      className="
w-full py-12 sm:py-16 lg:py-20 flex flex-col items-center relative overflow-hidden
bg-[url('/images/about-grid/mobile-poster.png')]
sm:bg-[url('/images/about-grid/Mainposter.png')]
bg-cover bg-center bg-no-repeat
"
    >
      <div className="w-full flex flex-col sm:items-center justify-center ">
        <div className="w-full max-w-4xl flex flex-col mr-52 lg:flex-row items-start justify-between px-4 sm:px-6 lg:px-8 gap-8 sm:gap-12 ">
          <div className="flex-1 flex flex-col gap-6 sm:gap-8">
            <h2
              className={`text-[#FF4500] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left ${
                locale === "km" ? "font-hanuman" : ""
              }`}
            >
              {locale === "en" ? (
                <>
                  DISCOVER THE PERFECT
                  <br />
                  SOLUTION FOR YOUR NEEDS.
                </>
              ) : (
                t("title")
              )}
            </h2>

            <div className="lg:mr-52 flex flex-col gap-8 sm:gap-12 lg:gap-16 sm:justify-center">
              {/* Active Lifestyles Card */}
              <div className="bg-[#00B4D8] card p-4 sm:p-6 text-white w-full max-w-3xl flex flex-col sm:flex-row relative min-h-[280px] sm:h-56 overflow-visible rounded-xl">
                <div className="flex-1 pr-32 pl-4">
                  <h3
                    className={`font-extrabold text-3xl mb-3 ${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("activeLifestyles.title")}
                  </h3>

                  <p
                    className={`text-base mb-4 opacity-90 mf-5 sm:text-xl ${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("activeLifestyles.subtitle")}
                  </p>
                   <p
                    className={`text-base mb-4 opacity-90 mf-5 sm:text-md${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("activeLifestyles.description")}
                  </p>
                  <div className="absolute bottom-2 right-5 z-10">
                    <Link href={`/${locale}/products`}>
                      <button
                        className={`bg-[#FF4500] text-white font-bold py-2 px-8 rounded-full text-sm flex items-center gap-2 hover:bg-[#ff5722] transition-colors ${
                          locale === "km" ? "font-hanuman" : ""
                        }`}
                      >
                        {t("activeLifestyles.button")}
                        <span className="text-xl">
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
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="absolute right-[-40px] bottom-[-0px]">
                  <Image
                    src="/images/History of CoCo Khmer 3/ActiveLifeStyle@4x.png"
                    alt="Active Lifestyle"
                    width={400}
                    height={400}
                    className="object-contain w-full max-w-[200px] sm:max-w-[250px]"
                  />
                </div>
              </div>

              {/* Everyday Relief Card */}
              <div className="bg-[#00A67E] card p-4 sm:p-6 text-white w-full max-w-3xl flex flex-col sm:flex-row relative min-h-[280px] sm:h-56 overflow-visible rounded-xl">
                <div className="flex-1 pr-32 pl-4">
                  <h3
                    className={`font-extrabold text-3xl mb-3 ${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("everydayRelief.title")}
                  </h3>

                  <p
                    className={`text-base mb-4 opacity-90  sm:text-xl${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("everydayRelief.subtitle")}
                  </p>
                  <p
                    className={`text-base mb-4 opacity-90 sm:text-md ${
                      locale === "km" ? "font-hanuman" : ""
                    }`}
                  >
                    {t("everydayRelief.description")}
                  </p>
                  <div className="absolute bottom-2 right-5 z-10">
                    <Link href={`/${locale}/products`}>
                      <button
                        className={`bg-[#FF4500] text-white font-bold py-2 px-8 rounded-full text-sm flex items-center gap-2 hover:bg-[#ff5722] transition-colors ${
                          locale === "km" ? "font-hanuman" : ""
                        }`}
                      >
                        {t("activeLifestyles.button")}
                        <span className="text-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
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
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-0px]">
                  <Image
                    src="/images/History of CoCo Khmer 3/DailyLifeStyle@4x.png"
                    alt="Daily Lifestyle"
                    width={400}
                    height={400}
                    className="object-contain w-full max-w-[200px] sm:max-w-[250px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSolutionSection;
