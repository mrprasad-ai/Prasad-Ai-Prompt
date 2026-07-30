import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 30000,
});

export const DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID ?? "";

export function hasNotionConfig() {
  return (
    Boolean(process.env.NOTION_TOKEN) &&
    Boolean(process.env.NOTION_DATA_SOURCE_ID)
  );
}