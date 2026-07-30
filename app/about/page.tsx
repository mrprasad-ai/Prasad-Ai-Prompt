import { Sparkles, Target, Compass } from "lucide-react";
import { FaInstagram, FaTelegramPlane, FaWhatsapp, FaYoutube } from "react-icons/fa";

import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import SectionHeader from "@/components/ui/SectionHeader";
import CTAButton from "@/components/ui/CTAButton";
import "@/styles/about-page.css";

export default function AboutPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <main className="pa-about-page">
        <Container>
          {/* Hero / Header Section */}
          <div className="about-hero">
            <SectionHeader
              title="About Us✨"
              description="Empowering creators with high-quality, production-ready AI prompts"
              align="left"
            />
          </div>

          {/* Mission & Vision Grid */}
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon-wrapper">
                <Target size={24} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To bridge the gap between creative imagination and AI generation. We test and curate top-tier prompts so you can get breathtaking visual and textual results instantly.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon-wrapper">
                <Sparkles size={24} />
              </div>
              <h3>What We Offer</h3>
              <p>
                From Midjourney cinematic photorealism to ChatGPT copy workflows, we bring you structured, easy-to-use prompts optimized for maximum efficiency.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon-wrapper">
                <Compass size={24} />
              </div>
              <h3>Curated Categories</h3>
              <p>
                Explore structured categories designed for digital artists, social media managers, developers, and AI enthusiasts seeking precision in every prompt.
              </p>
            </div>
          </div>

          {/* Social Community Section */}
          <div className="about-community-section">
            <div className="community-content">
              <h3>Join Our AI Creator Community</h3>
              <p>
                Stay updated with the latest AI trends, daily prompt releases, and tips on YouTube, Instagram, Telegram, and WhatsApp.
              </p>
            </div>

           <div className="about-social-grid">
              <a
                href="https://instagram.com/mr.prasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-card instagram">
                  <FaInstagram size={28} />
                </div>
                <span>Instagram</span>
              </a>

              <a
                href="https://t.me/mrprasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-card telegram">
                  <FaTelegramPlane size={28} />
                </div>
                <span>Telegram</span>
              </a>

              <a
                href="https://whatsapp.com/channel/0029VbCs9tv9cDDUOskp0s1u"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-card whatsapp">
                  <FaWhatsapp size={28} />
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href="https://youtube.com/@mrprasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-card youtube">
                  <FaYoutube size={28} />
                </div>
                <span>YouTube</span>
              </a>
            </div>
           
          </div>

          {/* Bottom Call-To-Action */}
          <div className="about-cta-card">
            <h2>Ready to transform your ideas?</h2>
            <p>Browse our handpicked prompt categories and start creating now.</p>
            <CTAButton href="/category">Explore Prompts</CTAButton>
          </div>

          {/* Simple Copyright Footer */}
          <div className="about-simple-footer">
            <p>© {currentYear} PrasadAI. All rights reserved.</p>
          </div>
        </Container>
      </main>
    </>
  );
}