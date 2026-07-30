"use client";

import Link from "next/link";
import Image from "next/image";
import "./prompt-card.css";
import {
  getCategoryBackground,
  getCategoryIconColor,
} from "@/lib/notion-categories";

export type PromptCardProps = {
  href?: string;
  slug?: string;
  title: string;
  description?: string;
  shortDescription?: string;
  thumbnail: string;
  category?: {
    name: string;
    color: string;
  }[];
  categoryColor?: string;
};

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
  category = [],
}: PromptCardProps) {
  // Safe href fallback setup
  const cardHref = href || (slug ? `/prompt/${slug}` : "#");
  const cardDescription = description || shortDescription || "No description available.";

  return (
    <article className="prompt-card" style={{ position: "relative" }}>
      {/* 1. Main Card Invisible Stretch Link */}
      <Link
        href={cardHref}
        className="prompt-card-main-link"
        aria-label={`Open ${title}`}
      />

      <div className="prompt-card-thumbnail">
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
      </div>

      <div className="prompt-card-content">
        <h3 className="prompt-card-title">{title}</h3>

        <p className="prompt-card-description">{cardDescription}</p>

        {category.length > 0 && (
          <div className="prompt-card-categories">
            {category.map((item) => (
              <Link
                key={item.name}
                href={`/category?category=${slugifyCategory(item.name)}`}
                className="prompt-card-category"
                prefetch={false}
                style={{
                  backgroundColor: getCategoryBackground(item.color),
                  color: getCategoryIconColor(item.color),
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}