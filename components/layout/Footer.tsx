import Link from "next/link";
import Container from "@/components/ui/Container";
import { FaInstagram, FaTelegramPlane, FaWhatsapp, FaYoutube } from "react-icons/fa";
import "@/styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-content">
          {/* Brand Name */}
          <h2 className="footer-brand-title">Prasad<span className="pa-logo-ai">Ai</span></h2>

          {/* Custom Message */}
          <p className="footer-message">
            Thanks for watching our posts and reels❤️<br /> If you find this prompt
            valuable, consider following us for high-quality, cinematic and
            ultra-realistic AI prompts.
          </p>

          {/* Social Follow Buttons */}
          <div className="footer-social-section">
            <span className="social-label">Follow Us</span>
            <div className="social-buttons">
              <a
                href="https://instagram.com/mr.prasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-btn instagram">
                  <FaInstagram className="btn-icon" size={28} />
                </div>
                <span>Instagram</span>
              </a>

              <a
                href="https://t.me/mrprasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-btn telegram">
                  <FaTelegramPlane className="btn-icon" size={28} />
                </div>
                <span>Telegram</span>
              </a>

              <a
                href="https://whatsapp.com/channel/0029VbCs9tv9cDDUOskp0s1u"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-btn whatsapp">
                  <FaWhatsapp className="btn-icon" size={28} />
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href="https://youtube.com/@mrprasad_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="social-item-wrapper"
              >
                <div className="social-btn youtube">
                  <FaYoutube className="btn-icon" size={28} />
                </div>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} PrasadAI. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}