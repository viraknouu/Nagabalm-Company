import Navbar from "../home/components/Navbar";
import ProductsHeroSection from "./components/HeroSection";
import ProductsGridSection from "./components/ProductsGridSection";
import CraftedCareSection from "./components/CraftedCareSection";
import Footer from "../home/components/Footer";

export default function Products() {
  return (
    <div>
      <Navbar />
      <ProductsHeroSection />
      <ProductsGridSection />
      <CraftedCareSection />
      <Footer />
    </div>
  );
}
