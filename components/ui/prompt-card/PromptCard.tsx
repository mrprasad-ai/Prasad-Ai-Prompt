"use client";

import Link from "next/link";
import Image from "next/image";
import "./prompt-card.css";
import { getCategoryIconColor } from "@/lib/notion-categories";
import { Eye, LayoutDashboard } from "lucide-react";
import * as LucideIcons from "lucide-react";

// 💡 Dynamic Icon Helper
function getDynamicIcon(iconName?: string) {
  if (!iconName) return LayoutDashboard;
  const formattedName = iconName.trim().replace(/[^a-zA-Z0-9]/g, "");
  const FoundIcon = (LucideIcons as Record<string, any>)[formattedName];
  return FoundIcon || LayoutDashboard;
}

export type PromptCardProps = {
  href?: string;
  slug?: string;
  title: string;
  description?: string;
  shortDescription?: string;
  thumbnail: string;
  views?: number;
  category?: {
    name: string;
    color: string;
    notionColor?: string;
  }[];
  categoryColor?: string;
};

// 💡 Views ko short format mein convert karne ka helper (jaise 1500 -> 1.5k)
function formatViews(count?: number) {
  if (!count || count === 0) return "0";
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
}

function slugifyCategory(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PromptCard({
  href,
  slug,
  title,
  description,
  shortDescription,
  thumbnail,
  views = 0, // Default 0
  category = [],
}: PromptCardProps) {
  const cardHref = href || (slug ? `/prompt/${slug}` : "#");
  const cardDescription = description || shortDescription || "No description available.";

  return (
    <article className="prompt-card" style={{ position: "relative" }}>
      <Link
        href={cardHref}
        className="prompt-card-main-link"
        aria-label={`Open ${title}`}
      />

      <div className="prompt-card-thumbnail" style={{ position: "relative" }}>
        <Image
          src={thumbnail || "/placeholder.jpg"}
          alt={title || "Prompt Image"}
          width={180}
          height={180}
          className="prompt-card-image"
          sizes="(max-width: 767px) 140px, (max-width: 1024px) 160px, 180px"
          loading="lazy"
          unoptimized
        />

        {/* 👁️ Thumbnail ke left-bottom corner par Views Badge */}
        <div className="prompt-views-badge">
          <Eye size={12} strokeWidth={2.2} />
          <span>{formatViews(views)}</span>
        </div>
      </div>

      <div className="prompt-card-content">
        <h3 className="prompt-card-title">{title}</h3>

        <p className="prompt-card-description">{cardDescription}</p>

        {category.length > 0 && (
          <div className="prompt-card-categories">
            {category.map((item: any) => {
            // 💡 Har category ka dynamic icon fetch karein
            const CatIcon = getDynamicIcon(item.icon);

            return (
              <Link
                key={item.name}
                href={`/category?category=${slugifyCategory(item.name)}`}
                className="prompt-card-category"
                prefetch={false}
                style={{
                  backgroundColor: item.color, 
                  color: getCategoryIconColor(item.notionColor || "default"),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px" // Icon aur text ke beech thoda sa space
                }}
              >
                  <CatIcon size={14} strokeWidth={2.2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}