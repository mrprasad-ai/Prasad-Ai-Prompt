import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function POST(request: Request) {
  try {
    const { pageId, currentViews } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    // Notion database mein number ko update karein
    await notion.pages.update({
      page_id: pageId,
      properties: {
        ViewsCount: {
          number: (currentViews || 0) + 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}