import React from "react";
import Navbar from "./home/components/Navbar";
import HeroSection from "./home/components/HeroSection";
import AvailableAtSection from "./home/components/AvailableAtSection";
import FeaturedSection from "./home/components/FeaturedSection";
import ModernizingSection from "./home/components/ModernizingSection";
import WhyNagaBalmSection from "./home/components/WhyNagaBalmSection";
import DiscoverSolutionSection from "./home/components/DiscoverSolutionSection";
import Footer from "./home/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AvailableAtSection />
      <FeaturedSection />
      <ModernizingSection />
      <WhyNagaBalmSection />
      <DiscoverSolutionSection />
      <Footer />
    </div>
  );
}
