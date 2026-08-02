import { richTextToPlainText } from "./notion-rich-text";


export function getTitle(properties: any): string {
  return richTextToPlainText(
    properties.Title?.title
  );
}

export function getSlug(properties: any): string {
  return richTextToPlainText(
    properties.Slug?.rich_text
  );
}

export function getShortDescription(properties: any): string {
  return richTextToPlainText(
    properties["Short Description"]?.rich_text
  );
}

export function getCategory(properties: any) {
  return (
    properties.Category?.multi_select?.map(
      (item: { name: string; color: string }) => ({
        name: item.name,
        color: item.color,
      })
    ) ?? []
  );
}

export function getCategoryColor(properties: any): string {
  return properties.Category?.multi_select?.[0]?.color ?? "default";
}

export function getThumbnail(properties: any): string {
  return properties["Thumbnail URL"]?.url ?? "";
}

export function getPublishDate(properties: any): string {
  return properties.Date?.date?.start ?? "";
}

export function isTrending(properties: any): boolean {
  return properties.Trending?.checkbox ?? false;
}

export function getViews(properties: any): number {
  return properties.ViewsCount?.number ?? 0;
}