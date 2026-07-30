"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Search, 
  Copy, 
  Bot, 
  Lightbulb, 
  CheckCircle2,
  PartyPopper
} from "lucide-react";
import "@/styles/how-to-use.css";

type HowToUseContentProps = {
  showImages?: boolean;
  showProTips?: boolean; 
};

export default function HowToUseContent({ 
  showImages = true, 
  showProTips = true 
}: HowToUseContentProps) {
  const [activeTab, setActiveTab] = useState<"en" | "hi">("en");

  return (
    <div className="htu-content-wrapper">
      {/* Header Tabs & Intro */}
      <div className="htu-header-section htu-no-padding-top">
        <div className="htu-lang-tabs">
          <button 
            type="button"
            className={`htu-tab-btn ${activeTab === "en" ? "active" : ""}`}
            onClick={() => setActiveTab("en")}
          >
            English
          </button>
          <button 
            type="button"
            className={`htu-tab-btn ${activeTab === "hi" ? "active" : ""}`}
            onClick={() => setActiveTab("hi")}
          >
            हिंदी
          </button>
        </div>

        <h2 className="htu-main-title">
          {activeTab === "en" ? "Create Amazing AI Images in Just 4 Simple Steps✨" : "सिर्फ 4 आसान चरणों में बेहतरीन AI इमेज बनाएं✨"}
        </h2>
        <p className="htu-subtitle">
          {activeTab === "en" 
            ? "Follow these simple steps to generate stunning AI images using our premium prompts. 🚀" 
            : "हमारे प्रीमियम प्रॉम्प्ट्स का उपयोग करके शानदार AI इमेज बनाने के लिए इन आसान चरणों का पालन करें। 🚀"}
        </p>
      </div>

      {/* Steps Container */}
      <div className="htu-steps-container">
        {/* Step 1 */}
        <div className="htu-step-card">
          <div className="htu-step-badge">1</div>
          <div className="htu-step-content">
            <h2><Search size={22} /> {activeTab === "en" ? "Step 1 — Find Your Favorite Prompt" : "स्टेप 1 — अपना पसंदीदा प्रॉम्प्ट खोजें"}</h2>
            <p>
              {activeTab === "en" 
                ? "Browse our prompt gallery and choose the AI prompt that matches the image style you want to create." 
                : "हमारी प्रॉम्प्ट गॅलेरी ब्राउज़र करें और वह AI प्रॉम्प्ट चुनें जो आपकी पसंद की इमेज स्टाइल से मेल खाता हो।"}
            </p>
          </div>
          {showImages && (
            <div className="htu-preview-box">
              <img src="/images/htustep1.webp" alt="Step 1 Preview" className="htu-step-img" />
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="htu-step-card">
          <div className="htu-step-badge">2</div>
          <div className="htu-step-content">
            <h2><Copy size={22} /> {activeTab === "en" ? "Step 2 — Copy the Prompt" : "स्टेप 2 — प्रॉम्प्ट कॉपी करें"}</h2>
            <p>
              {activeTab === "en" 
                ? "Open the selected prompt and tap the \"Copy Prompt\" button to instantly copy the complete prompt to your clipboard." 
                : "चयनित प्रॉम्प्ट खोलें और पूरे प्रॉम्प्ट को तुरंत कॉपी करने के लिए \"Copy Prompt\" बटन पर टैप करें।"}
            </p>
          </div>
          {showImages && (
            <div className="htu-preview-box">
              <img src="/images/htustep2.webp" alt="Step 2 Preview" className="htu-step-img" />
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="htu-step-card">
          <div className="htu-step-badge">3</div>
          <div className="htu-step-content">
            <h2><Bot size={22} /> {activeTab === "en" ? "Step 3 — Open AI Tool & Upload Reference Photo" : "स्टेप 3 — AI टूल खोलें और रेफरेंस फोटो अपलोड करें"}</h2>
            <p>
              {activeTab === "en" 
                ? "Tap \"Open ChatGPT\" or \"Open Gemini\". For best results, upload a clear, high-quality reference photo along with the prompt." 
                : "\"Open ChatGPT\" या \"Open Gemini\" पर टैप करें। सबसे अच्छे परिणामों के लिए, प्रॉम्प्ट के साथ एक साफ, हाई-क्वालिटी रेफरेंस फोटो अपलोड करें।"}
            </p>
            <ul className="htu-sub-list">
              <li>{activeTab === "en" ? "Make sure your face is clearly visible." : "सुनिश्चित करें कि आपका चेहरा साफ दिखाई दे।"}</li>
              <li>{activeTab === "en" ? "Good lighting, no heavy filters or sunglasses." : "अच्छी रोशनी हो, कोई भारी फिल्टर या चश्मा न हो।"}</li>
            </ul>
          </div>
          {showImages && (
            <div className="htu-preview-box">
              <img src="/images/htustep3.webp" alt="Step 3 Preview" className="htu-step-img" />
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className="htu-step-card">
          <div className="htu-step-badge">4</div>
          <div className="htu-step-content">
            <h2><Sparkles size={22} /> {activeTab === "en" ? "Step 4 — Paste & Generate" : "स्टेप 4 — पेस्ट करें और जनरेट करें"}</h2>
            <p>
              {activeTab === "en" 
                ? "Paste the copied prompt into the AI tool, adjust your name/details if needed, and hit generate to get your masterpiece!" 
                : "कॉपी किए गए प्रॉम्प्ट को AI टूल में पेस्ट करें, यदि आवश्यक हो तो अपना नाम/विवरण बदलें और अपनी मास्टरपीस प्राप्त करें!"}
            </p>
          </div>
          {showImages && (
            <div className="htu-preview-box">
              <img src="/images/htustep4.webp" alt="Step 4 Preview" className="htu-step-img" />
            </div>
          )}
        </div>

        {/* --- Final Result Generated Card --- */}
        <div className="htu-step-card final-result-card">
          <div className="htu-step-content htu-final-content">
            <div className="htu-final-title-row">
              <PartyPopper size={24} className="htu-party-icon" />
              <h2>{activeTab === "en" ? "Final Result Generated" : "अंतिम परिणाम जनरेट हो गया 🎉"}</h2>
            </div>
            <p className="htu-final-desc">
              {activeTab === "en" 
                ? "Your high-quality AI-generated image is now ready! Download it and share it on Instagram, WhatsApp, or anywhere you like.✨" 
                : "आपकी हाई-क्वालिटी AI-जनरेटेड इमेज अब तैयार है! इसे डाउनलोड करें और इंस्टाग्राम, व्हाट्सएप या कहीं भी शेयर करें।✨"}
            </p>
          </div>
          {showImages && (
            <div className="htu-preview-box htu-final-preview">
              <img src="/images/htustep5.webp" alt="Final Result Preview" className="htu-step-img" />
            </div>
          )}
        </div>
      </div>

      {/* Pro Tips Section */}
      {showProTips && (
        <div className="htu-pro-tips-card">
          <div className="pro-tips-header">
            <Lightbulb size={24} className="tip-icon" />
            <h3>{activeTab === "en" ? "Pro Tips 😍" : "प्रो टिप्स 😍"}</h3>
          </div>
          <p className="pro-tips-intro">
            {activeTab === "en" 
              ? "For the best face match and highest-quality results, keep these tips in mind:" 
              : "सर्वोत्तम चेहरे के मिलान और उच्च गुणवत्ता वाले परिणामों के लिए इन बातों का ध्यान रखें:"}
          </p>
          <ul className="pro-tips-list">
            <li><CheckCircle2 size={16} /> {activeTab === "en" ? "Use a clear, high-resolution reference photo." : "एक स्पष्ट, हाई-रिज़ॉल्यूशन वाली रेफरेंस फोटो का उपयोग करें।"}</li>
            <li><CheckCircle2 size={16} /> {activeTab === "en" ? "Make sure your face is fully visible and facing the camera." : "सुनिश्चित करें कि आपका चेहरा पूरी तरह से दिखाई दे रहा हो और कैमरा की ओर हो।"}</li>
            <li><CheckCircle2 size={16} /> {activeTab === "en" ? "Choose a photo with good lighting and a natural expression." : "अच्छी रोशनी और स्वाभाविक अभिव्यक्ति वाली फोटो चुनें।"}</li>
            <li><CheckCircle2 size={16} /> {activeTab === "en" ? "Avoid blurry images, sunglasses, masks, or heavy filters." : "धुंधली छवियों, धूप का चश्मा, मास्क या भारी फिल्टर से बचें।"}</li>
            <li><CheckCircle2 size={16} /> {activeTab === "en" ? "Upload only one person's photo for the most accurate face match." : "चेहरे के सबसे सटीक मिलान के लिए केवल एक व्यक्ति की फ़ोटो अपलोड करें।"}</li>
          </ul>
          <div className="pro-tips-footer">
            ✨ {activeTab === "en" ? "The better your reference photo, the more realistic, accurate, and professional your AI-generated image will be. 🚀" : "जितनी अच्छी आपकी रेफरेंस फोटो होगी, आपकी AI-जनरेटेड इमेज उतनी ही रियलिस्टिक और प्रोफ़ेसनल होगी। 🚀"}
          </div>
        </div>
      )}
    </div>
  );
}