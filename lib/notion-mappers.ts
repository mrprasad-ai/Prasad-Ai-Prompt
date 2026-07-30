import { Prompt } from "@/types/prompt";
import {
  getTitle,
  getSlug,
  getShortDescription,
  getCategory,
  getCategoryColor,
  getThumbnail,
  getPublishDate,
  isTrending,
} from "./notion-utils";

export function mapPrompt(page: any): Prompt {
  const { properties } = page;

  return {
    id: page.id,
    title: getTitle(properties),
    slug: getSlug(properties),
    shortDescription: getShortDescription(properties),
    category: getCategory(properties),
    categoryColor: getCategoryColor(properties),
    thumbnail: getThumbnail(properties),
    publishDate: getPublishDate(properties),
    trending: isTrending(properties),
  };
}