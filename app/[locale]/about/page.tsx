import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import AboutHeroSection from "./components/HeroSection";
import OurStorySection from "./components/OurStorySection";
import OurJourneySection from "./components/OurJourneySection";
import TheSpiritSection from "./components/TheSpiritSection";
import ValuesVisionMissionSection from "./components/ValuesVisionMissionSection";
import TeamsSection from "./components/TeamsSection";
import CommunitySection from "./components/CommunitySection";

export default function About() {
  return (
    <div>
      <Navbar />
      <AboutHeroSection />
      <OurStorySection />
      <OurJourneySection />
      <TheSpiritSection />
      <ValuesVisionMissionSection />
      <TeamsSection />
      <CommunitySection />
      <Footer />
    </div>
  );
} 