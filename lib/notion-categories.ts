import { DATA_SOURCE_ID, notion } from "./notion";
import { Category } from "@/types/prompt";

//------------------Category Color Maping--------------------//

const NOTION_CATEGORY_COLORS: Record<string, string> = {
  default: "#F3F4F6",

  gray: "#DCE1E8",
  brown: "#E8D2C2",

  red: "#FFCACA",
  orange: "#FFD2A8",
  yellow: "#FFE49A",

  green: "#BDEFCB",

  blue: "#BFDFFF",

  purple: "#D9C3FF",

  pink: "#FFC8E3",
};

export function getCategoryBackground(notionColor: string): string {
  return (
    NOTION_CATEGORY_COLORS[notionColor] ??
    NOTION_CATEGORY_COLORS.default
  );
}

const CATEGORY_ORDER = [
  "babys-photography",
  "birthday-and-greetings",
  "double-exposure",
  "dp-prompt",
  "nature-and-travels",
  "others",
] as const;

export function getCategoryIconColor(color: string): string {
  switch (color) {
    case "gray":
      return "#475569";

    case "brown":
      return "#92400E";

    case "orange":
      return "#EA580C";

    case "yellow":
      return "#D97706";

    case "green":
      return "#16A34A";

    case "blue":
      return "#2563EB";

    case "purple":
      return "#7C3AED";

    case "pink":
      return "#DB2777";

    case "red":
      return "#DC2626";

    default:
      return "#6366F1";
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,

    filter: {
      property: "Publish",
      checkbox: {
        equals: true,
      },
    },

    page_size: 100,
  });

    // Map to collect categories by slug
    const categoryMap = new Map<string, Category>();

  response.results.forEach((page: any) => {
    const categories =
      page.properties.Category?.multi_select ?? [];

    categories.forEach((category: any) => {
      const slug = category.name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/'/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      if (!categoryMap.has(slug)) {
       categoryMap.set(slug, {
          id: slug,
          name: category.name,
          slug,
          notionColor: category.color,
          color: getCategoryBackground(category.color),
          promptCount: 0,
});
      }

      categoryMap.get(slug)!.promptCount!++;
    });
  });

  const categories = [...categoryMap.values()];
  categories.sort((a, b) => {
  const aIndex = CATEGORY_ORDER.indexOf(
    a.slug as (typeof CATEGORY_ORDER)[number]
  );
  const bIndex = CATEGORY_ORDER.indexOf(
    b.slug as (typeof CATEGORY_ORDER)[number]
  );

  const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
  const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

  return safeA - safeB;
});

return categories;
}