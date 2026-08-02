"use client";

import Container from "@/components/ui/Container";
import { Category } from "@/types/prompt";
import { getCategoryIconColor } from "@/lib/notion-categories";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

type CategoriesProps = {
  categories: Category[];
};

// Helper function jo Notion se aane wale icon string ko Lucide Icon component mein convert karega
function getDynamicIcon(iconName?: string) {
  if (!iconName) return LucideIcons.LayoutDashboard;

  const formattedName = iconName
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "");

  const FoundIcon = (LucideIcons as Record<string, any>)[formattedName];
  return FoundIcon || LucideIcons.LayoutDashboard;
}

export default function Categories({ categories }: CategoriesProps) {
  if (!categories.length) return null;

  return (
    <section className="categories-section">
      <Container>
        <div className="categories-header">
          <h3 className="categories-title">
            Browse by Categories
          </h3>

          <Link
            href="/category"
            className="categories-view-all"
          >
            View all →
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            // category.icon mein Notion database ki property se icon ka naam aayega (jaise "Baby", "Sparkles", etc.)
            const IconComponent = getDynamicIcon(category.icon);

            return (
              <Link
                key={category.id}
                href={`/category?category=${category.slug}`}
                className="category-card"
                style={{ backgroundColor: category.color }}
              >
                <div className="category-icon">
                  <IconComponent
                    size={24}
                    strokeWidth={2.2}
                    color={getCategoryIconColor(category.notionColor || category.color || "default")}
                  />
                </div>

                <h3
                  className="category-name"
                  style={{
                    color: getCategoryIconColor(category.notionColor || category.color || "default"),
                  }}
                >
                  {category.name}
                </h3>
              </Link> 
            );
          })}
        </div>
      </Container>
    </section>
  );
}