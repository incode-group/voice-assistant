export interface KBSection {
  url: string;
  label: string;
  content: string;
}

export function labelFromUrl(rawUrl: string): string {
  try {
    const { pathname } = new URL(rawUrl);
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Home";
    return parts[parts.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return rawUrl;
  }
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
}

export function parseKnowledgeBase(raw: string): KBSection[] {
  const chunks = raw.split(/\n{0,2}---\n{0,2}/);
  const sections: KBSection[] = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const pageMatch = trimmed.match(/^##\s+Page:\s+(https?:\/\/\S+)/);
    if (!pageMatch) continue;

    const pageUrl = pageMatch[1];
    const content = decodeEntities(trimmed.slice(pageMatch[0].length).trim());

    sections.push({ url: pageUrl, label: labelFromUrl(pageUrl), content });
  }

  return sections;
}