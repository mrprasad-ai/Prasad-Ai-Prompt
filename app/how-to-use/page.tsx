import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HowToUseContent from "@/components/HowToUseContent";
import CTAButton from "@/components/ui/CTAButton";
import { ArrowRight } from "lucide-react";
import "@/styles/how-to-use.css";

export default function HowToUsePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="htu-page-layout">
      <Header />
      <main className="htu-page-wrapper">
        <div className="htu-page-title-box">
          <h1>How to use?</h1>
        </div>

        {/* 💡 Yahan images ke sath content render hoga */}
        <HowToUseContent />

        <div className="htu-cta-container">
          <CTAButton href="/" className="htu-explore-btn">
            Explore Prompts
            <ArrowRight size={18} />
          </CTAButton>
        </div>
      </main>
      <Footer />
    </div>
  );
}