import { Category } from "@/types/prompt";

const NOTION_CATEGORY_COLORS: Record<string, string> = {
  default: "#F3F4F6", gray: "#DCE1E8", brown: "#E8D2C2",
  red: "#FFCACA", orange: "#FFD2A8", yellow: "#FFE49A",
  green: "#BDEFCB", blue: "#BFDFFF", purple: "#D9C3FF", pink: "#FFC8E3",
};

export function getCategoryBackground(notionColor: string): string {
  return NOTION_CATEGORY_COLORS[notionColor] ?? NOTION_CATEGORY_COLORS.default;
}

export function getCategoryIconColor(color: string): string {
  switch (color) {
    case "gray": return "#475569"; case "brown": return "#92400E";
    case "orange": return "#EA580C"; case "yellow": return "#D97706";
    case "green": return "#16A34A"; case "blue": return "#2563EB";
    case "purple": return "#7C3AED"; case "pink": return "#DB2777";
    case "red": return "#DC2626"; default: return "#6366F1";
  }
}

export async function getCategories(): Promise<Category[]> {
  const databaseId = "3af89450d59980c2b81fc93fa2e5beb6";
  const notionToken = process.env.NOTION_TOKEN;

  if (!notionToken) {
    console.error("NOTION_TOKEN missing in .env.local");
    return [];
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Active",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Order", direction: "ascending" }],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Notion API error:", await res.text());
      return [];
    }

    const response = await res.json();

    return response.results.map((page: any) => {
      const properties = page.properties;
      const notionColor = properties.Color?.select?.name?.toLowerCase() ?? "default";
      const iconValue = properties.Icon?.rich_text?.[0]?.plain_text ?? 
       properties.Icon?.select?.name ?? properties.Icon?.title?.[0]?.plain_text ?? "LayoutDashboard";
      
       return {
        id: page.id,
        name: properties.Name?.title?.[0]?.plain_text ?? "Uncategorized",
        slug: properties.Slug?.rich_text?.[0]?.plain_text ?? "",
        icon: iconValue.trim(),
        notionColor: notionColor,
        color: getCategoryBackground(notionColor),
        promptCount: properties.Prompts?.relation?.length ?? 0,
      };
    });
    
  } catch (error) {
    console.error("Category fetch error:", error);
    return [];
  }
}