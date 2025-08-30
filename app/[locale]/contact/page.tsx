import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import ContactHeroSection from "./components/HeroSection";
import ContactFormSection from "./components/ContactFormSection";
import DiscoverSolutionSection from "./components/DiscoverSolutionSection";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <ContactHeroSection />
      <ContactFormSection />
      <DiscoverSolutionSection />
      <Footer />
    </div>
  );
} 