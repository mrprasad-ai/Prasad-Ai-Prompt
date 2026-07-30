export function getNotionImageUrl(files: any[] = []): string {
  if (!files.length) {
    return "";
  }

  const file = files[0];

  if (file.type === "file") {
    return file.file.url;
  }

  if (file.type === "external") {
    return file.external.url;
  }

  return "";
}