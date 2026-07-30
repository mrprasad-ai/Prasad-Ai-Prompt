import { DATA_SOURCE_ID, notion } from "./notion";

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function slugExists(
  slug: string
): Promise<boolean> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,

    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },

    page_size: 1,
  });

  return response.results.length > 0;
}

export async function getAllPromptSlugs(): Promise<string[]> {
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

  return response.results
    .map(
      (page: any) =>
        page.properties.Slug?.rich_text?.[0]?.plain_text
    )
    .filter(Boolean);
}

export async function getPromptStaticParams() {
  const slugs = await getAllPromptSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}