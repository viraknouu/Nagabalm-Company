import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import WhereToFindHeroSection from "./components/HeroSection";
import LocationsSection from "./components/LocationsSection";

export default function WhereToFind() {
  return (
    <div>
      <Navbar />
      <WhereToFindHeroSection />
      <LocationsSection />
      <Footer />
    </div>
  );
} 