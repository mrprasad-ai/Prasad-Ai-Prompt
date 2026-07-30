import Container from "@/components/ui/Container";
import { Category } from "@/types/prompt";
import { getCategoryIconColor } from "@/lib/notion-categories";
import Link from "next/link";

import { Baby, Cake, Images , CircleUserRound,Trees, LayoutDashboard, Sparkles, } from "lucide-react";

type CategoriesProps = {
  categories: Category[];
};

const CATEGORY_ICONS = {
  "babys-photography": Baby,
  "birthday-and-greetings": Cake,
  "double-exposure": Images,
  "dp-prompt": CircleUserRound,
  "nature-and-travels": Trees,
  others: Sparkles,
} as const;

function getCategoryIcon(slug: string) {
  return CATEGORY_ICONS[
    slug as keyof typeof CATEGORY_ICONS
  ] ?? LayoutDashboard;
}

export default function Categories({
  categories,
}: CategoriesProps) {
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
          {categories.map((category) => (
           <Link
                key={category.id}
                href={`/category?category=${category.slug}`}
                className="category-card"
                style={{ backgroundColor: category.color }}
              >
              <div className="category-icon">
                {(() => {
                  const Icon = getCategoryIcon(category.slug);
                  return <Icon
                          size={24}
                          strokeWidth={2.2}
                           color={getCategoryIconColor(category.notionColor || category.color || "default")}
                        />
                })()}
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
          ))}
        </div>
      </Container>
    </section>
  );
}

