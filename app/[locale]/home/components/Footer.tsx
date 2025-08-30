import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();
  const email = "info@thenagabalm.com";
  const phone = "+855 16 269 359";

  return (
    <footer className="bg-white w-full pt-6 sm:pt-8 md:pt-10 pb-8 relative overflow-hidden text-gray-700">
      {/* Background Logo - Desktop only (hidden on mobile) */}
      <div className="hidden lg:block absolute right-[-15%] top-[1%] w-96 h-96 xl:w-[500px] xl:h-[500px] 2xl:w-[600px] 2xl:h-[600px] opacity-50 pointer-events-none">
        <Image
          src="/images/Logo/Naga Balm__Brandmark_Fire.png"
          alt={t("description")}
          fill
          className="object-contain opacity-50"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-12">
        {/* Left Block */}
        <div className="lg:flex-[1.5] max-w-sm">
          <Image
            src="/images/Logo/Logo-Portrait-Full.png"
            alt="Naga Balm Logo"
            width={180}
            height={100}
            className="mb-4 w-36 h-auto"
          />
          <p className="text-sm leading-relaxed mb-4">{t("description")}</p>
          <div
            className={`font-bold uppercase text-sm ${locale === "km" ? "font-hanuman" : ""}`}
          >
            {t("madeInCambodia")}
          </div>
        </div>

        {/* Middle Block */}
        <div className="flex flex-col gap-12 lg:flex-1">
          {/* Company Links */}
          <div>
            <h4 className="font-bold uppercase mb-4">{t("company")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#F9461C] transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F9461C] transition-colors">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F9461C] transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F9461C] transition-colors">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F9461C] transition-colors">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/where-to-find" className="hover:text-[#F9461C] transition-colors">
                  {t("findUsAt")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="font-bold uppercase mb-4">{t("products")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products/ingredients"
                  className="text-[#F9461C] font-bold hover:text-[#d13a17] transition-colors"
                >
                  {t("ingredients")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Block */}
        <div className="lg:flex-[1.5] max-w-sm">
          <h4 className="font-bold uppercase mb-4">{t("contactUs")}</h4>
          <div className="mb-6 space-y-2 text-sm">
            <div>
              <span className="font-semibold">{t("email")}</span>
              <br />
              <a href={`mailto:${email}`} className="text-[#F9461C] hover:underline">
                {email}
              </a>
            </div>
            <div>
              <span className="font-semibold">{t("phone")}</span>
              <br />
              <a href={`tel:${phone}`} className="text-[#F9461C] hover:underline">
                {phone}
              </a>
            </div>
          </div>

          <div className="font-bold mb-4">{t("followUs")}</div>
          <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/nagabalmkh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M279.14 288l14.22-92.66h-88.91V127.39c0-25.35

        12.42-50.06 52.24-50.06h40.42V6.26S293.76 0 
        268.46 0C173.3 0 137.41 54.42 137.41 
        123.26v72.08H76.2V288h61.21v224h100.2V288z"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/nagabalm?igsh=dWhhYW1sd3M4d2Iy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,2.2c3.2,0,3.6,0,4.8.1c3.3.1,4.8,1.7,4.9,4.9c.1,1.2.1,1.6.1,4.8s0,3.6-.1,4.8c-.1,3.2-1.7,4.8-4.9,4.9c-1.2.1-1.6.1-4.8.1s-3.6,0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9c-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2,1.7-4.8,4.9-4.9c1.2-.1,1.6-.1,4.8-.1M12,0C8.7,0,8.3,0,7.1.1c-4.4.2-6.8,2.6-7,7C0,8.3,0,8.7,0,12s0,3.7.1,4.9c.2,4.4,2.6,6.8,7,7C8.3,24,8.7,24,12,24s3.7,0,4.9-.1c4.4-.2,6.8-2.6,7-7C24,15.7,24,15.3,24,12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm6.4-10.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,18.4,5.5Z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/nagabalm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="p-2 bg-[#F9461C] hover:bg-[#d13a17] rounded-full transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 496 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.6 169.9-40.8 192.5c-3.1 13.9-11.4 17.3-23 10.8l-63.6-46.9-30.7 29.6c-3.4 3.4-6.3 6.3-12.9 6.3l4.6-65.1 118.6-106.9c5.2-4.6-1.1-7.2-8-2.6L152 280.4l-62.7-19.6c-13.6-4.2-13.9-13.6 2.8-20.1l244.6-94.2c11.4-4.2 21.4 2.6 17.9 20.4z" />
                </svg>
              </a>
            </div>

          <div>
            <h4 className="font-bold uppercase mb-2 mt-3">{t("visitUs")}</h4>
            <address className="text-sm not-italic leading-relaxed">
              {t("address")}
            </address>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-100 pt-4">
        {t("copyright")}
      </div>
    </footer>
  );
};

export default Footer;