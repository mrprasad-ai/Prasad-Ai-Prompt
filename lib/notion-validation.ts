export function hasTitle(properties: any): boolean {
  return (properties.Title?.title?.length ?? 0) > 0;
}

export function hasSlug(properties: any): boolean {
  return (properties.Slug?.rich_text?.length ?? 0) > 0;
}

export function isPublished(properties: any): boolean {
  return properties.Publish?.checkbox === true;
}

export function hasCategory(properties: any): boolean {
  return properties.Category?.select != null;
}

export function hasThumbnail(properties: any): boolean {
  return (properties.Thumbnail?.files?.length ?? 0) > 0;
}

export function isValidPrompt(properties: any): boolean {
  return (
    hasTitle(properties) &&
    hasSlug(properties) &&
    isPublished(properties) &&
    hasCategory(properties) &&
    hasThumbnail(properties)
  );
}