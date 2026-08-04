"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft, Copy, Check, FileText, HelpCircle, X, Lightbulb, Zap, CalendarHeart } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { VscOpenai } from "react-icons/vsc";
import { RiGeminiFill } from "react-icons/ri";
import { getCategoryIconColor } from "@/lib/notion-categories";

import HowToUseContent from "@/components/HowToUseContent";
import CTAButton from "@/components/ui/CTAButton"; 
import "@/styles/prompt-detail.css";

// 💡 Dynamic Icon Helper
function getDynamicIcon(iconName?: string) {
  if (!iconName) return LayoutDashboard;
  const formattedName = iconName.trim().replace(/[^a-zA-Z0-9]/g, "");
  const FoundIcon = (LucideIcons as Record<string, any>)[formattedName];
  return FoundIcon || LayoutDashboard;
}

type PromptDetailProps = {
  prompt: {
    id: string;
    title: string;
    slug: string;
    views?: number;
    description?: string;
    category?: {
      name: string;
      slug: string;
      color: string;
      notionColor?: string;
      icon?: string;
    }[];
    thumbnail: string;
    publishDate?: string;
    promptTexts: { plain: string; html: string }[]; 
    customContentHtml?: string;
    noteText?: string;
    similarPrompts?: { id: string; title: string; thumbnail: string; slug?: string; }[];
  };
};

export default function PromptDetailClient({ prompt }: PromptDetailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 View Count Increment Effect
  useEffect(() => {
    const viewedKey = `viewed_${prompt.id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      const currentViews = (prompt as any).views || 0;

      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pageId: prompt.id, 
          currentViews: currentViews 
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            sessionStorage.setItem(viewedKey, "true");
          }
        })
        .catch((err) => console.error("Failed to update view count", err));
    }
  }, [prompt.id]);

  const handleCopy = async (plainText: string, index: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        return;
      }
    } catch (err) {
      console.log("Clipboard API failed...", err);
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

  const categories = Array.isArray(prompt.category) ? prompt.category : [];
  const primaryCategory = categories.length > 0 ? categories[0] : { name: "Prompts", slug: "all" };

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
          <Link href={`/category?category=${primaryCategory.slug}`}>
            {primaryCategory.name}
          </Link>
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
        
        {/* 💡 Multiple Categories & Publish Date Row */}
        <div className="meta-row" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginTop: "10px" }}>
          {categories.map((cat, idx) => {
            const CatIcon = getDynamicIcon(cat.icon);
            const tColor = getCategoryIconColor(cat.notionColor || "default");
            
            return (
              <Link 
                key={idx}
                href={`/category?category=${cat.slug || "all"}`} 
                className="category-pill"
                style={{ 
                  backgroundColor: cat.color || "#F3F4F6",
                  color: tColor,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <CatIcon size={15} strokeWidth={2.2} color={tColor} />
                <span>{cat.name}</span>
              </Link>
            );
          })}

          {/* Publish Date with Calendar Icon */}
          {prompt.publishDate && (
            <div className="prompt-publish-date" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500, marginLeft: categories.length > 0 ? "0px" : "0px" }}>
              <CalendarHeart size={15} strokeWidth={2} />
              <span>
                {new Date(prompt.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
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

      {/* --- HOW TO USE POPUP MODAL --- */}
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

      {/* --- Similar Prompts Section --- */}
      {prompt.similarPrompts && prompt.similarPrompts.length > 0 && (
        <div className="similar-prompts-section">
          <h3 className="similar-section-title">Similar Prompts</h3>
          
          <div className="similar-prompts-slider">
            {prompt.similarPrompts.map((item: any, idx: number) => {
              const cardHref = `/prompt/${item.slug || item.id}`;
              return (
                <Link 
                  href={cardHref} 
                  key={idx} 
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div className="similar-prompt-card" style={{ cursor: "pointer" }}>
                    <div className="similar-img-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                    <h4 className="similar-title">{item.title}</h4>
                    
                    <CTAButton href={cardHref} className="similar-try-btn">
                     <Zap size={16} />
                     <span>Try Prompt</span>
                    </CTAButton>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}