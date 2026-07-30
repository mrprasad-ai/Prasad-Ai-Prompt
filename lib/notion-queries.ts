import { DATA_SOURCE_ID, notion } from "./notion";
import { mapPrompt } from "./notion-mappers";
import { Prompt } from "@/types/prompt";

export async function getTrendingPrompts(): Promise<Prompt[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      and: [
        { property: "Publish", checkbox: { equals: true } },
        { property: "Trending", checkbox: { equals: true } },
      ],
    },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results.map(mapPrompt);
}

export async function getLatestPrompts(): Promise<Prompt[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "Publish",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results.map(mapPrompt);
}

export async function getAllPrompts(): Promise<Prompt[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "Publish",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results.map(mapPrompt);
}

// Helper: Rich Text se Plain Text aur HTML nikalne ke liye
function processRichText(richTextArray: any[]) {
  let html = "";
  let plain = "";
  
  richTextArray.forEach((t: any) => {
    let textPlain = t.plain_text;
    let textHtml = t.plain_text;

    // Formatting tags
    if (t.annotations.bold) textHtml = `<strong>${textHtml}</strong>`;
    if (t.annotations.italic) textHtml = `<em>${textHtml}</em>`;
    if (t.annotations.underline) textHtml = `<u>${textHtml}</u>`;
    if (t.annotations.code) textHtml = `<code>${textHtml}</code>`;

    // Color & Highlight Handle karna
    if (t.annotations.color && t.annotations.color !== "default") {
      const isBg = t.annotations.color.includes("_background");
      const baseColor = t.annotations.color.replace("_background", "");
      // UI readability ke liye Notion ke basic colors ko thoda adjust kiya gaya hai
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

    html += textHtml;
    plain += textPlain;
  });
  
  return { html, plain };
}

/*=======================================
            ✅Prompt Detail Page
=======================================*/ 

export async function getPromptBySlug(slug: string): Promise<any | null> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      and: [
        { property: "Publish", checkbox: { equals: true } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
  });

  if (response.results.length === 0) return null;

  const page = response.results[0];
  const basePrompt = mapPrompt(page);
  
  let calloutTexts: { plain: string; html: string }[] = [];
  let hdImageUrl = ""; 
  let customContentHtml = ""; 
  let currentListType: "bulleted" | "numbered" | null = null; 
  let hasSeenCallout = false; 

  try {
    const blocksResponse = await (notion as any).blocks.children.list({ block_id: page.id });
    const blocks = blocksResponse.results;

    // 1. 🖼️ HD IMAGE FETCH
    const imageBlock = blocks.find((b: any) => b.type === "image");
    if (imageBlock) {
      hdImageUrl = imageBlock.image.type === "external" 
        ? imageBlock.image.external.url 
        : imageBlock.image.file.url;
    }

    // 2. 📝 CUSTOM TEXT BLOCKS (Sirf Callout se pehle wale)
    for (const block of blocks) {
      if (block.type === "image") {
        if (currentListType) {
          customContentHtml += currentListType === "bulleted" ? "</ul>" : "</ol>";
          currentListType = null;
        }
        continue;
      }

      if (block.type === "callout") {
        hasSeenCallout = true; 
        if (currentListType) {
          customContentHtml += currentListType === "bulleted" ? "</ul>" : "</ol>";
          currentListType = null;
        }
        continue;
      }

      if (currentListType && block.type !== "bulleted_list_item" && block.type !== "numbered_list_item") {
        customContentHtml += currentListType === "bulleted" ? "</ul>" : "</ol>";
        currentListType = null;
      }

      if (!hasSeenCallout) {
        if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
          const pText = processRichText(block.paragraph.rich_text).html;
          customContentHtml += `<p>${pText}</p>`;
        } 
        else if (block.type.startsWith("heading_")) {
          const level = block.type.split("_")[1];
          const hText = processRichText(block[block.type].rich_text).html;
          customContentHtml += `<h${level}>${hText}</h${level}>`;
        } 
        else if (block.type === "bulleted_list_item") {
          if (currentListType !== "bulleted") {
            customContentHtml += '<ul>';
            currentListType = "bulleted";
          }
          const liText = processRichText(block.bulleted_list_item.rich_text).html;
          customContentHtml += `<li>${liText}</li>`;
        } 
        else if (block.type === "numbered_list_item") {
           if (currentListType !== "numbered") {
            customContentHtml += '<ol>';
            currentListType = "numbered";
          }
          const liText = processRichText(block.numbered_list_item.rich_text).html;
          customContentHtml += `<li>${liText}</li>`;
        }
      }
    }
    
    if (currentListType === "bulleted") customContentHtml += "</ul>";
    if (currentListType === "numbered") customContentHtml += "</ol>";

    // 3. 📦 CALLOUT (PROMPT) FETCH
    const calloutBlocks = blocks.filter((b: any) => b.type === "callout");
    for (const block of calloutBlocks) {
        const mainText = processRichText(block.callout.rich_text);
        let combinedPlain = mainText.plain;
        let combinedHtml = mainText.html;
 
        if (block.has_children) {
          const childrenResponse = await (notion as any).blocks.children.list({ block_id: block.id });
          let listCounter = 1;
 
          childrenResponse.results.forEach((child: any) => {
            let richText = [];
            let prefixPlain = "";
            let prefixHtml = "";
 
            if (child.type === "paragraph") {
              richText = child.paragraph.rich_text;
              prefixPlain = "\n\n";
              prefixHtml = "\n\n";
              listCounter = 1; 
            } else if (child.type === "bulleted_list_item") {
              richText = child.bulleted_list_item.rich_text;
              prefixPlain = "\n• ";
              prefixHtml = "\n• ";
            } else if (child.type === "numbered_list_item") {
              richText = child.numbered_list_item.rich_text;
              prefixPlain = `\n${listCounter}. `;
              prefixHtml = `\n${listCounter}. `;
              listCounter++;
            } else {
              listCounter = 1;
            }
 
            if (richText && richText.length > 0) {
              const childProcessed = processRichText(richText);
              combinedPlain += prefixPlain + childProcessed.plain;
              combinedHtml += prefixHtml + childProcessed.html;
            }
          });
        }
        
        calloutTexts.push({ plain: combinedPlain, html: combinedHtml });
      }

  } catch (error) {
    console.warn("Block fetch karne mein issue aayi:", error);
  }

  // 4. ⚡ SIMILAR PROMPTS FETCH (Bina error ke safe query)
  let similarPrompts: any[] = [];
  try {
    const similarRes = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      filter: {
        property: "Publish",
        checkbox: { equals: true },
      },
      page_size: 6, // Current ko chhod kar 5-6 lene ke liye
    });

    similarPrompts = similarRes.results
      .map(mapPrompt)
      .filter((p: any) => p.id !== basePrompt.id)
      .slice(0, 4); // Max 5 similar prompts
  } catch (err) {
    console.warn("Similar prompts fetch nahi ho paye:", err);
  }

  return {
    ...basePrompt,
    thumbnail: hdImageUrl || "/placeholder.jpg",
    promptTexts: calloutTexts.length > 0 ? calloutTexts : [{ plain: (basePrompt as any).description || "", html: (basePrompt as any).description || "" }],
    customContentHtml: customContentHtml, 
    noteText: (basePrompt as any).note || "Note: For better results try 2-3 times in Gemini or ChatGPT",
    similarPrompts: similarPrompts, // 💡 Yeh safe similar prompts array pass ho raha hai
  };
}