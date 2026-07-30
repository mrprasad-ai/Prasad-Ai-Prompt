"use client";

import { useState } from "react";
import Link from "next/link";
import { Baby, Cake, CircleUserRound, Images, Trees, Shapes, LayoutDashboard,
  ArrowLeft, Copy, Check, FileText, HelpCircle, X, Lightbulb,
 } from "lucide-react";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { VscOpenai } from "react-icons/vsc";
import { RiGeminiFill } from "react-icons/ri";

import HowToUseContent from "@/components/HowToUseContent";
import CTAButton from "@/components/ui/CTAButton"; 
import "@/styles/prompt-detail.css";

const CATEGORY_ICONS: Record<string, any> = {
  "babys-photography": Baby,
  "birthday-and-greetings": Cake,
  "birthday & greetings": Cake, 
  "double-exposure": Images,
  "dp-prompt": CircleUserRound,
  "nature-and-travels": Trees,
  "nature & travels": Trees,
  others: Shapes,
};

function getCategoryIcon(slug: string, name: string) {
  const cleanSlug = slug?.toLowerCase().trim();
  const cleanName = name?.toLowerCase().trim();

  return CATEGORY_ICONS[cleanSlug] || CATEGORY_ICONS[cleanName] || LayoutDashboard ;
}

type PromptDetailProps = {
  prompt: {
    id: string;
    title: string;
    description?: string;
    category?: any;
    categorySlug?: string;
    thumbnail: string;
    promptTexts: { plain: string; html: string }[]; 
    customContentHtml?: string;
    noteText?: string;
    similarPrompts?: { id: string; title: string; thumbnail: string; }[];
  };
};

export default function PromptDetailClient({ prompt }: PromptDetailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated handleCopy with Fallback for Mobile / HTTP environment
  const handleCopy = async (plainText: string, index: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        return;
      }
    } catch (err) {
      console.log("Clipboard API failed, trying fallback...", err);
    }

    // Fallback method for mobile/HTTP environments where clipboard API is restricted
    try {
      const textArea = document.createElement("textarea");
      textArea.value = plainText;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        alert("Failed to copy prompt.");
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      alert("Copy not supported on this browser.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description || "Check out this amazing AI prompt!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    }
  };

  let categoryName = "";
  let categoryColor = "default";
  let categorySlug = "";

  if (Array.isArray(prompt.category) && prompt.category.length > 0) {
    categoryName = prompt.category[0].name || prompt.category[0];
    categoryColor = prompt.category[0].color || "default";
    categorySlug = prompt.category[0].slug || categoryName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  } else if (typeof prompt.category === "object" && prompt.category !== null) {
    categoryName = prompt.category.name;
    categoryColor = prompt.category.color || "default";
    categorySlug = prompt.category.slug || categoryName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  } else if (typeof prompt.category === "string") {
    categoryName = prompt.category;
    categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  }

  const IconComponent = getCategoryIcon(categorySlug, categoryName);
  const primaryPromptText = prompt.promptTexts[0]?.plain || "";
  const encodedPrompt = encodeURIComponent(primaryPromptText);
  const chatGptUrl = `https://chatgpt.com/?q=${encodedPrompt}`;
  const geminiUrl = `https://gemini.google.com/app`;

  return (
    <div className="pa-prompt-detail-wrapper">
      <div className="prompt-top-bar">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="sep">&gt;</span>
          {categoryName ? (
            <Link href={`/category?category=${encodeURIComponent(categoryName)}`}>
              {categoryName}
            </Link>
          ) : (
            <span>Prompts</span>
          )}
          <span className="sep">&gt;</span>
          <span className="active-crumb" title={prompt.title}>{prompt.title}</span>
        </div>

        <Link href="/category" className="back-btn">
          <ArrowLeft size={16} className="back-icon" />
          <span className="back-text">Back to Library</span>
        </Link>
      </div>

      <div className="prompt-header-section">
        <div className="title-flex-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h1 className="prompt-title" style={{ margin: 0 }}>{prompt.title}</h1>
          <button 
            type="button" 
            className="title-share-btn" 
            onClick={handleShare}
            aria-label="Share prompt"
          >
            <FaRegShareFromSquare size={20} />
          </button>
        </div>
        
        <div className="meta-row">
          {categoryName && (
            <Link 
              href={`/category?category=${encodeURIComponent(categoryName)}`} 
              className={`category-pill color-${categoryColor}`}
            >
              <IconComponent size={18} strokeWidth={2.2} />
              <span>{categoryName}</span>
            </Link>
          )}
        </div>

        {prompt.description && <p className="prompt-subtitle">{prompt.description}</p>}
      </div>

      <div className="prompt-image-container">
        {prompt.thumbnail && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={prompt.thumbnail}
            alt={prompt.title}
            className="prompt-preview-img"
          />
        )}
      </div>

      {prompt.customContentHtml && (
        <div 
          className="prompt-custom-content"
          dangerouslySetInnerHTML={{ __html: prompt.customContentHtml }}
        />
      )}

     {prompt.promptTexts.map((textObj, idx) => {
        let customLabel = "";
        let cleanHtml = textObj.html;
        let cleanPlain = textObj.plain.trim();
        
        if (cleanPlain.toLowerCase().startsWith("for boy:")) {
          customLabel = "Boy Prompt";
          cleanPlain = cleanPlain.replace(/^for boy:\s*/i, "");
          cleanHtml = cleanHtml.replace(/^for boy:\s*/i, "");
        } else if (cleanPlain.toLowerCase().startsWith("for girl:")) {
          customLabel = "Girl Prompt";
          cleanPlain = cleanPlain.replace(/^for girl:\s*/i, "");
          cleanHtml = cleanHtml.replace(/^for girl:\s*/i, "");
        } else if (cleanPlain.toLowerCase().startsWith("boy:")) {
          customLabel = "Boy Prompt";
          cleanPlain = cleanPlain.replace(/^boy:\s*/i, "");
          cleanHtml = cleanHtml.replace(/^boy:\s*/i, "");
        } else if (cleanPlain.toLowerCase().startsWith("girl:")) {
          customLabel = "Girl Prompt";
          cleanPlain = cleanPlain.replace(/^girl:\s*/i, "");
          cleanHtml = cleanHtml.replace(/^girl:\s*/i, "");
        }

        const labelText = customLabel || `Prompt ${prompt.promptTexts.length > 1 ? idx + 1 : ""}`;

        return (
          <div className="prompt-card-box" key={idx}>
            <div className="prompt-card-header">
              <div className="card-label">
                <FileText size={18} />
                <span>{labelText}</span>
              </div>
              <button 
                type="button"
                className={`copy-btn ${copiedIndex === idx ? "copied" : ""}`}
                onClick={() => handleCopy(cleanPlain, idx)}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="prompt-card-content">
              <p 
                className="prompt-text"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            </div>
          </div>
        );
      })}
      
      {/* Action Buttons Grid */}
      <div className="prompt-actions-grid">
        <CTAButton href={chatGptUrl} target="_blank" className="action-btn chatgpt">
          <VscOpenai size={20} />
          <span>Open in ChatGPT</span>
        </CTAButton>
        
        <CTAButton href={geminiUrl} target="_blank" className="action-btn gemini">
          <RiGeminiFill size={18} />
          <span>Open in Gemini</span>
        </CTAButton>

        <button 
          type="button" 
          className="action-btn how-to-use-trigger"
          onClick={() => setIsModalOpen(true)}
        >
          <HelpCircle size={19} />
          <span>How to use this Prompt?</span>
        </button>
      </div>

      {/* --- HOW TO USE POPUP MODAL (Without Images) --- */}
      {isModalOpen && (
        <div className="pa-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="pa-modal-content pa-htu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pa-modal-header">
              <span className="modal-title-top"></span>
              <button 
                type="button" 
                className="pa-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

           <div className="pa-modal-body">
              <HowToUseContent showImages={false} showProTips={false} />

              <div className="pa-popup-pro-tip">
                <div className="pro-tips-header" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Lightbulb size={18} className="tip-icon" style={{ color: "#eab308" }} />
                  <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 700, color: "#0f172a" }}>Pro Tips</h4>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.4, margin: 0 }}>
                  ✨ The better your reference photo, the more realistic, accurate, and professional your AI-generated image will be. 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Note / Recommended Settings */}
      {prompt.noteText && (
        <div className="prompt-note-box">
          <h4>💡 Important Note / Recommended Settings:</h4>
          <p>{prompt.noteText}</p>
        </div>
      )}

      {/* --- Similar Prompts Section (Main Page pe Note ke niche) --- */}
      {prompt.similarPrompts && prompt.similarPrompts.length > 0 && (
        <div className="similar-prompts-section">
          <h3 className="similar-section-title">Similar Prompts</h3>
          
          <div className="similar-prompts-slider">
            {prompt.similarPrompts.map((item: any, idx: number) => (
              <div className="similar-prompt-card" key={idx}>
                <div className="similar-img-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <h4 className="similar-title">{item.title}</h4>
                <CTAButton href={`/prompt/${item.slug || item.id}`} className="similar-try-btn">Try Prompt</CTAButton>
               
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}