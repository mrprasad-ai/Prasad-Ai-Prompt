import { Prompt, Category } from "@/types/prompt";
import {
  getTitle,
  getSlug,
  getShortDescription,
  getThumbnail,
  getPublishDate,
  isTrending,
} from "./notion-utils";

export function mapPrompt(page: any, allCategories: Category[] = []): Prompt {
  const { properties } = page;

  // 1. Notion se relation data nikalein (jisme user ki select ki gayi sequence hoti hai)
  const relationData = properties.Categories?.relation || properties.Category?.relation || [];

  // 2. Relation data ke order ke hisab se categories ko map karein
  const matchedCategories = relationData
    .map((rel: any) => allCategories.find((cat) => cat.id === rel.id))
    .filter(Boolean); // undefined values ko hatane ke liye

  return {
    id: page.id,
    title: getTitle(properties),
    views: properties.ViewsCount?.number ?? 0,
    slug: getSlug(properties),
    shortDescription: getShortDescription(properties),
    
    // 3. Exact wahi order return hoga jo Notion mein select kiya gaya hai
    category: matchedCategories.length > 0 
      ? matchedCategories.map((cat: any) => ({ 
          name: cat.name, 
          slug: cat.slug,
          color: cat.color, 
          notionColor: cat.notionColor,
          icon: cat.icon 
        }))
      : [{ name: "Uncategorized", slug: "all", color: "#F3F4F6", notionColor: "default", icon: "LayoutDashboard" }],
    
    thumbnail: getThumbnail(properties),
    publishDate: page.properties.PublishDate?.date?.start || page.created_time,
    trending: isTrending(properties),
  };
}