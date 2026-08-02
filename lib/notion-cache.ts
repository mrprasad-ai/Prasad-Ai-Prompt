export const NOTION_REVALIDATE = 60;

export const NOTION_CACHE_TAGS = {
  prompts: "prompts",
  trending: "trending",
  latest: "latest",
  categories: "categories",
} as const;

export function getNotionFetchOptions() {
  return {
    next: {
      revalidate: NOTION_REVALIDATE,
      tags: Object.values(NOTION_CACHE_TAGS),
    },
  };
}