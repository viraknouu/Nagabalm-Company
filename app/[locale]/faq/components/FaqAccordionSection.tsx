"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const styles = {
  faqSection: "w-full bg-[#CFE8EE] py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 overflow-hidden",
  container: "max-w-6xl mx-auto",
  content: "flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 lg:gap-12",
  leftColumn: "flex-1 w-full lg:w-auto",
  rightColumn: "flex-1 max-w-none lg:max-w-2xl w-full",
  faqList: "flex flex-col gap-3 sm:gap-4",
  faqItem: "border-2 border-gray-400 rounded-lg bg-white transition-all duration-200 shadow-sm hover:shadow-md",
  question: "w-full flex justify-between rounded-md items-center px-4 sm:px-6 py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-gray-900 focus:outline-none focus:ring-opacity-20",
  open: "bg-[#FFF]",
  icon: "ml-2 sm:ml-4 text-[#F9461C] text-xl sm:text-2xl flex-shrink-0",
  answer: "px-4 rounded-md sm:px-6 py-2 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed transition-all duration-700 hover:shadow-2xl",
  inlineLink: "text-[#F9461C] font-medium hover:underline"
};

const FAQItem = ({
  question,
  answer,
  linkText,
  linkSuffix,
  isOpen,
  onToggle,
  questionIndex
}: {
  question: string;
  answer: string;
  linkText?: string | null;
  linkSuffix?: string | null;
  isOpen: boolean;
  onToggle: () => void;
  questionIndex: number;
}) => {
  const isFirstFAQ = questionIndex === 0;
  const isB2BFAQ = questionIndex === 13;

  const formattedAnswer = answer.split('\n').map((line, index, array) => {
    if (isFirstFAQ && linkText) {
      return (
        <React.Fragment key={index}>
          {line}
          <Link href="/products" className={styles.inlineLink}>{linkText}</Link>
          {index < array.length - 1 && <br />}
        </React.Fragment>
      );
    }
    if (isB2BFAQ && linkText) {
      return (
        <React.Fragment key={index}>
          {line}
          <Link href="/contact" className={styles.inlineLink}>{linkText}</Link>
          {linkSuffix || ""}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    );
  });

  return (
    <motion.div
      className={styles.faqItem}
    // initial={false}
    >
      <button
        className={`${styles.question} ${isOpen ? styles.open : ''}`}
        onClick={onToggle}
      >
        <span>{question}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: isOpen ? 90 : 0 }}
        >
         <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="lucide lucide-arrow-right-icon lucide-arrow-right"
>
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>

        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            transition={{ duration: 0.1 }}
            className='text-gray-700 p-4 hover:shadow-2xl transition-transform duration-700 transform'
            // className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 'auto', opacity: 0 }}
          // transition={{ duration: 0.3 }}
          >
            {formattedAnswer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const FaqAccordionSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');
  return (
    <section className={styles.faqSection + " relative"}>
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white z-0" />
      <div className={styles.container + " relative z-10"}>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <div className="flex flex-col justify-start items-start max-w-xl z-10 mt-0 text-center lg:text-left">
              <h1 className="text-[#F9461C] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight">
                {t('hero.title')}
              </h1>
              <div className="text-[#F9461C] italic text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                {t('hero.subtitle')}
              </div>
              <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed max-w-lg">
                {t('hero.description')}
                <Link href="/contact" className="text-[#F9461C] underline font-semibold hover:text-[#d6381b] transition">
                  {t('hero.contactUs')}
                </Link>.
              </p>
            </div>
          </div>
          <motion.div
            className={styles.rightColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.faqList}>
              {Array.from({ length: 14 }, (_, i) => {
                const questionKey = `questions.${i}`;
                const question = t(`${questionKey}.question`);
                const answer = t(`${questionKey}.answer`);
                const linkText = t.has(`${questionKey}.linkText`) ? t(`${questionKey}.linkText`) : null;
                const linkSuffix = t.has(`${questionKey}.linkSuffix`) ? t(`${questionKey}.linkSuffix`) : null;

                return (
                  <FAQItem
                    key={i}
                    question={question}
                    answer={answer}
                    linkText={linkText}
                    linkSuffix={linkSuffix}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                    questionIndex={i}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordionSection;