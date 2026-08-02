import { mapPrompt } from "./notion-mappers";
import { Prompt } from "@/types/prompt";
import { getCategories } from "./notion-categories";

const PROMPT_DATABASE_ID = "39d89450d59980018793e4b240cd6d5d";

async function queryNotionDatabase(bodyPayload: any) {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    console.error("NOTION_TOKEN missing in .env.local");
    return { results: [] };
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${PROMPT_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Notion API error:", await res.text());
      return { results: [] };
    }

    return await res.json();
  } catch (error) {
    console.error("Notion fetch error:", error);
    return { results: [] };
  }
}

export async function getTrendingPrompts(): Promise<Prompt[]> {
  const [response, allCategories] = await Promise.all([
    queryNotionDatabase({
      filter: {
        and: [
          { property: "Publish", checkbox: { equals: true } },
          { property: "Trending", checkbox: { equals: true } },
        ],
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    }),
    getCategories()
  ]);
  return (response.results || []).map((page: any) => mapPrompt(page, allCategories));
}

export async function getLatestPrompts(): Promise<Prompt[]> {
  const [response, allCategories] = await Promise.all([
    queryNotionDatabase({
      filter: { property: "Publish", checkbox: { equals: true } },
      sorts: [{ property: "Date", direction: "descending" }],
    }),
    getCategories()
  ]);
  return (response.results || []).map((page: any) => mapPrompt(page, allCategories));
}

export async function getAllPrompts(): Promise<Prompt[]> {
  const [response, allCategories] = await Promise.all([
    queryNotionDatabase({
      filter: { property: "Publish", checkbox: { equals: true } },
      sorts: [{ property: "Order", direction: "ascending" }],
    }),
    getCategories()
  ]);
  return (response.results || []).map((page: any) => mapPrompt(page, allCategories));
}

function processRichText(richTextArray: any[]) {
  let html = ""; let plain = "";
  if (!richTextArray) return { html, plain };
  richTextArray.forEach((t: any) => {
    let textPlain = t.plain_text; let textHtml = t.plain_text;
    if (t.annotations.bold) textHtml = `<strong>${textHtml}</strong>`;
    if (t.annotations.italic) textHtml = `<em>${textHtml}</em>`;
    if (t.annotations.underline) textHtml = `<u>${textHtml}</u>`;
    if (t.annotations.code) textHtml = `<code>${textHtml}</code>`;
    if (t.annotations.color && t.annotations.color !== "default") {
      const isBg = t.annotations.color.includes("_background");
      const baseColor = t.annotations.color.replace("_background", "");
      const colorMap: Record<string, string> = {
        gray: "#6b7280", brown: "#92400e", orange: "#ea580c", 
        yellow: "#ca8a04", green: "#16a34a", blue: "#2563eb", 
        purple: "#9333ea", pink: "#db2777", red: "#dc2626"
      };
      const hexColor = colorMap[baseColor] || baseColor;
      if (isBg) {
        textHtml = `<span style="background-color: ${hexColor}33; padding: 2px 4px; border-radius: 4px;">${textHtml}</span>`;
      } else {
        textHtml = `<span style="color: ${hexColor}; font-weight: 600;">${textHtml}</span>`;
      }
    }
    html += textHtml; plain += textPlain;
  });
  return { html, plain };
}

export async function getPromptBySlug(slug: string): Promise<any | null> {
  const notionToken = process.env.NOTION_TOKEN;
  const [response, allCategories] = await Promise.all([
    queryNotionDatabase({
      filter: {
        and: [
          { property: "Publish", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
    }),
    getCategories()
  ]);

  if (!response.results || response.results.length === 0) return null;
  const page = response.results[0];
  const basePrompt = mapPrompt(page, allCategories);
  
  let calloutTexts: { plain: string; html: string }[] = [];
  let hdImageUrl = ""; let customContentHtml = ""; 
  let currentListType: "bulleted" | "numbered" | null = null; 
  let hasSeenCallout = false; 

  try {
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
      },
      cache: "no-store",
    });
    const blocksResponse = await blocksRes.json();
    const blocks = blocksResponse.results || [];
    const imageBlock = blocks.find((b: any) => b.type === "image");
    
    if (imageBlock) {
      hdImageUrl = imageBlock.image.type === "external" ? imageBlock.image.external.url : imageBlock.image.file.url;
    }

    for (const block of blocks) {
      if (block.type === "image" || block.type === "callout") {
        if (block.type === "callout") hasSeenCallout = true; 
        if (currentListType) { customContentHtml += currentListType === "bulleted" ? "</ul>" : "</ol>"; currentListType = null; }
        continue;
      }
      if (currentListType && block.type !== "bulleted_list_item" && block.type !== "numbered_list_item") {
        customContentHtml += currentListType === "bulleted" ? "</ul>" : "</ol>"; currentListType = null;
      }
      if (!hasSeenCallout) {
        if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
          const pText = processRichText(block.paragraph.rich_text).html; customContentHtml += `<p>${pText}</p>`;
        } else if (block.type.startsWith("heading_")) {
          const level = block.type.split("_")[1]; const hText = processRichText(block[block.type].rich_text).html; customContentHtml += `<h${level}>${hText}</h${level}>`;
        } else if (block.type === "bulleted_list_item") {
          if (currentListType !== "bulleted") { customContentHtml += '<ul>'; currentListType = "bulleted"; }
          const liText = processRichText(block.bulleted_list_item.rich_text).html; customContentHtml += `<li>${liText}</li>`;
        } else if (block.type === "numbered_list_item") {
           if (currentListType !== "numbered") { customContentHtml += '<ol>'; currentListType = "numbered"; }
          const liText = processRichText(block.numbered_list_item.rich_text).html; customContentHtml += `<li>${liText}</li>`;
        }
      }
    }
    
    if (currentListType === "bulleted") customContentHtml += "</ul>";
    if (currentListType === "numbered") customContentHtml += "</ol>";

    const calloutBlocks = blocks.filter((b: any) => b.type === "callout");
    for (const block of calloutBlocks) {
        const mainText = processRichText(block.callout.rich_text);
        let combinedPlain = mainText.plain; let combinedHtml = mainText.html;
        if (block.has_children) {
          const childRes = await fetch(`https://api.notion.com/v1/blocks/${block.id}/children`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${notionToken}`,
              "Notion-Version": "2022-06-28",
            },
            cache: "no-store",
          });
          const childrenResponse = await childRes.json();
          let listCounter = 1;
          (childrenResponse.results || []).forEach((child: any) => {
            let richText = []; let prefixPlain = ""; let prefixHtml = "";
            if (child.type === "paragraph") { richText = child.paragraph.rich_text; prefixPlain = "\n\n"; prefixHtml = "\n\n"; listCounter = 1; } 
            else if (child.type === "bulleted_list_item") { richText = child.bulleted_list_item.rich_text; prefixPlain = "\n• "; prefixHtml = "\n• "; } 
            else if (child.type === "numbered_list_item") { richText = child.numbered_list_item.rich_text; prefixPlain = `\n${listCounter}. `; prefixHtml = `\n${listCounter}. `; listCounter++; } 
            else { listCounter = 1; }
            if (richText && richText.length > 0) {
              const childProcessed = processRichText(richText);
              combinedPlain += prefixPlain + childProcessed.plain; combinedHtml += prefixHtml + childProcessed.html;
            }
          });
        }
        calloutTexts.push({ plain: combinedPlain, html: combinedHtml });
      }
  } catch (error) {
    console.warn("Block fetch karne mein issue aayi:", error);
  }

  let similarPrompts: any[] = [];
  try {
    const similarRes = await queryNotionDatabase({
      filter: { property: "Publish", checkbox: { equals: true } },
      page_size: 6,
    });
    similarPrompts = (similarRes.results || [])
      .map((p: any) => mapPrompt(p, allCategories))
      .filter((p: any) => p.id !== basePrompt.id)
      .slice(0, 4); 
  } catch (err) {
    console.warn("Similar prompts fetch nahi ho paye:", err);
  }

  return {
    ...basePrompt,
    thumbnail: hdImageUrl || "/placeholder.jpg",
    promptTexts: calloutTexts.length > 0 ? calloutTexts : [{ plain: (basePrompt as any).description || "", html: (basePrompt as any).description || "" }],
    customContentHtml: customContentHtml, 
    noteText: (basePrompt as any).note || "Note: For better results try 2-3 times in Gemini or ChatGPT",
    similarPrompts: similarPrompts, 
  };
}

// ... (baki saare purane functions jaise getTrendingPrompts, getAllPrompts, getPromptBySlug yahan upar rahenge)
export async function getPromptsByCategorySlug(categorySlug: string): Promise<Prompt[]> {
  const [response, allCategories] = await Promise.all([
    queryNotionDatabase({
      filter: {
        property: "Publish",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    }),
    getCategories()
  ]);

  // 1. Target category ko slug se dhoondho
  const targetCategory = allCategories.find((cat) => cat.slug === categorySlug);
  if (!targetCategory) return [];

  // 2. Saare prompts ko map karo
  const allPrompts = (response.results || []).map((page: any) => mapPrompt(page, allCategories));
  
  // 3. Smart Filtering: Relation ID YA Category Name dono se match karwao
  return allPrompts.filter((prompt: any) => {
    const page = response.results.find((p: any) => p.id === prompt.id);
    if (!page) return false;

    // Notion relation data
    const relationData = page.properties.Categories?.relation || page.properties.Category?.relation || [];
    const isIdMatched = relationData.some((rel: any) => rel.id === targetCategory.id);

    // Prompt object ke andar ki category name match (Fallback)
    const isNameMatched = prompt.category?.some((c: any) => 
      c.name.trim().toLowerCase() === targetCategory.name.trim().toLowerCase()
    );

    return isIdMatched || isNameMatched;
  });
}