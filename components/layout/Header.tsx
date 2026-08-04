"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { FaInstagram, FaTelegramPlane, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { PiInfoDuotone, PiHouseLineDuotone, PiLightningDuotone, PiQrCodeDuotone, PiQuestionMarkDuotone  } from "react-icons/pi";

import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import CTAButton from "@/components/ui/CTAButton";
import Divider from "@/components/ui/Divider";
import SearchModal from "@/components/layout/SearchModal";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const closeDrawer = () => {
    const drawer = document.getElementById("mobile-drawer") as HTMLDetailsElement;
    if (drawer) drawer.open = false;
  };

  return (
    <>
      <header className="pa-header">
        <Container>
          <div className="pa-header-inner">
            
            {/* Native Mobile Menu Drawer */}
            <details className="pa-native-drawer" id="mobile-drawer">
              <summary className="pa-menu-toggle" aria-label="Open menu">
                <Menu size={28} strokeWidth={2.2} />
              </summary>

              {/* Outside Backdrop Overlay (Click Outside to Close) */}
              <div className="drawer-overlay" onClick={closeDrawer} />

              {/* Mobile Drawer Content */}
              <div className="pa-mobile-drawer-content">
                
                {/* Top Bar with Close Button */}
                <div className="drawer-top-bar">
                  <span className="drawer-menu-title">Menu</span>
                  <button 
                    type="button"
                    className="pa-mobile-close" 
                    onClick={closeDrawer}
                    aria-label="Close menu"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Compact Navigation Links */}
                <nav className="pa-mobile-nav">
                  <Link href="/" onClick={closeDrawer}>
                   <PiHouseLineDuotone size={16} style={{ color: "#08df70" }}/>
                   <span> Home</span>
                  </Link>
                  <Link href="/latest" onClick={closeDrawer}>
                   <PiLightningDuotone size={16} style={{ color: "#eb2599" }} />
                   <span> Latest Prompts</span>
                  </Link>
                  <Link href="/category" className="categories-view-all" onClick={closeDrawer}>
                    <PiQrCodeDuotone size={16} style={{ color: "#25c0eb" }} />
                    <span> Categories</span>
                  </Link>
                  <Link href="/how-to-use" onClick={closeDrawer}>
                    <PiQuestionMarkDuotone size={16} style={{ color: "#f8ae0f" }} />
                    <span> How to use?</span>
                  </Link>
                  <Link href="/about" onClick={closeDrawer}>
                   <PiInfoDuotone size={16} style={{ color: "#9e04e6" }} />
                   <span> About</span>
                  </Link>
                </nav>    


              {/* Social Links Section */}
                <div className="drawer-social-section">
                  <span className="drawer-social-title">Follow Us</span>
                  <div className="drawer-social-grid">
                    <a href="https://instagram.com/mr.prasad_ai" target="_blank" rel="noopener noreferrer" className="drawer-social-item">
                      <div className="drawer-social-btn instagram">
                        <FaInstagram size={24} />
                      </div>
                      <span>Instagram</span>
                    </a>
                    <a href="https://t.me/mrprasad_ai" target="_blank" rel="noopener noreferrer" className="drawer-social-item">
                      <div className="drawer-social-btn telegram">
                        <FaTelegramPlane size={24} />
                      </div>
                      <span>Telegram</span>
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbCs9tv9cDDUOskp0s1u" target="_blank" rel="noopener noreferrer" className="drawer-social-item">
                      <div className="drawer-social-btn whatsapp">
                        <FaWhatsapp size={24} />
                      </div>
                      <span>WhatsApp</span>
                    </a>
                    <a href="https://youtube.com/@mrprasad_ai" target="_blank" rel="noopener noreferrer" className="drawer-social-item">
                      <div className="drawer-social-btn youtube">
                        <FaYoutube size={24} />
                      </div>
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
                
                {/* Compact CTA Button */}
                <div className="drawer-cta-wrapper">
                  <CTAButton href="/category" fullWidth onClick={closeDrawer}>
                    Explore Prompts
                  </CTAButton>
                </div>

              </div>
            </details>

            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="pa-header-nav">
              <Link href="/">Home</Link>
              <Link href="/latest">Latest Prompts</Link>
              <Link href="/category">Categories</Link>
              <Link href="/about">About</Link>
              
              {/* Desktop Search Trigger */}
              <button
                type="button"
                className="pa-header-search"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={19} />
              </button>
            </nav>

            {/* Desktop CTA */}
            <CTAButton href="/category" variant="header" className="pa-header-cta">
              Explore Prompts
            </CTAButton>

            {/* Mobile Search Trigger Button (Fixed) */}
            <button
              type="button"
              className="pa-mobile-search"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={21} />
            </button>
          </div>
        </Container>
      </header>

      <Divider gradient />

      {/* Global Search Modal Component (Added) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}