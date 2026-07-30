"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";
import "@/styles/search-modal.css";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Fixed duplicate 'Cinematic' tag
const TRENDING_TAGS = [
  "Cinematic",
  "Birthday",
  "Baby",
  "Nature",
  "Travel",
  "Dp Prompt",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="pa-search-overlay" onClick={onClose}>
      <div className="pa-search-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Input Bar */}
        <form onSubmit={handleSearchSubmit} className="pa-search-input-wrapper">
          <Search size={20} className="pa-search-icon" />
          <input
            type="text"
            placeholder="Search prompts, categories, style..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* Top Right: Single Clean Close Icon */}
          <button
            type="button"
            className="pa-search-modal-close"
            onClick={query ? () => setQuery("") : onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </form>

        {/* Modal Content */}
        <div className="pa-search-body">
          {!query ? (
            <div className="pa-search-trending">
              <span className="trending-title">
                <Sparkles size={14} /> Trending Topics
              </span>
              <div className="trending-tags">
                {TRENDING_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    onClick={onClose}
                    className="tag-item"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="pa-search-action-wrapper">
              {/* Left Side: Plain Suggestion Text with Ellipsis safety */}
              <span 
                className="pa-search-suggestion-text"
                onClick={handleSearchSubmit}
                title={`Search for "${query.trim()}"`}
              >
                Search for "<strong>{query.trim()}</strong>"
              </span>

              {/* Right Bottom Corner: Compact Gradient CTA Button */}
             <CTAButton 
                  type="submit" 
                  className="pa-search-corner-btn"
                  onClick={handleSearchSubmit}
                  style={{
                    height: "28px",
                    minHeight: "unset",
                    width: "auto",
                    maxWidth: "fit-content",
                    padding: "0 10px",
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Search <ArrowRight size={13} style={{ marginLeft: "4px" }} />
                </CTAButton>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}