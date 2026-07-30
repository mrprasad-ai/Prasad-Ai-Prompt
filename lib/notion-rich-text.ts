export function richTextToPlainText(richText: any[] = []): string {
  if (!Array.isArray(richText) || richText.length === 0) {
    return "";
  }

  return richText
    .map((item) => item.plain_text)
    .join("")
    .trim();
}