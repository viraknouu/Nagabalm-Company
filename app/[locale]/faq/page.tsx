import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import FaqHeroSection from "./components/HeroSection";
import FaqAccordionSection from "./components/FaqAccordionSection";
import DiscoverSolutionSection from "./components/DiscoverSolutionSection";

export default function FAQ() {
  return (
    <div>
      <Navbar />
      <FaqHeroSection />
      <FaqAccordionSection />
      <DiscoverSolutionSection />
      <Footer />
    </div>
  );
} 