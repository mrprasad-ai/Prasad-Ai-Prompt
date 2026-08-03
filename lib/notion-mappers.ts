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

  // 1. Relation ID check (Categories ya Category)
  const relationData = properties.Categories?.relation || properties.Category?.relation || [];
  const categoryId = relationData.length > 0 ? relationData[0].id : null;

  // 2. Match category from the fetched list
  const matchedCategory = allCategories.find((cat) => cat.id === categoryId);

  // 3. Extract Views directly from ViewsCount number property
  const viewsValue = properties.ViewsCount?.number ?? 0;

  return {
    id: page.id,
    title: getTitle(properties),
    views: properties.ViewsCount?.number ?? 0,
    slug: getSlug(properties),
    shortDescription: getShortDescription(properties),
    
    // Category mapping with name, background color, and notion color support
    // mapPrompt function ke andar:
category: matchedCategory 
  ? [{ 
      name: matchedCategory.name, 
      slug: matchedCategory.slug,
      color: matchedCategory.color, 
      notionColor: matchedCategory.notionColor,
      icon: matchedCategory.icon 
    }] 
  : [{ name: "Uncategorized", slug: "all", color: "#F3F4F6", notionColor: "default", icon: "LayoutDashboard" }],
    
    thumbnail: getThumbnail(properties),
    publishDate: page.properties.PublishDate?.date?.start || page.created_time,
    trending: isTrending(properties),
  };
}