const SCRAPING_ROBOT_TOKEN = process.env.SCRAPING_ROBOT_TOKEN!

import {
  SCRAPER_CRAWLABLE_PREFIXES,
  SCRAPER_ROOT_PAGES,
} from "../config/constants";

export async function scrapeIncodeWebsite(): Promise<string> {
  const allUrls = await discoverAllUrls();
  console.log(`[Scraper] Found ${allUrls.size} pages to scrape`);

  const results: string[] = [];
  let savedFooter: string | null = null;

  for (const url of allUrls) {
    const scraped = await scrapePage(url);
    if (scraped) {
      results.push(scraped.body);
      if (!savedFooter && scraped.footer) {
        savedFooter = scraped.footer;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  let output = results.join("\n\n---\n\n");
  
  if (savedFooter) {
    output += "\n\n---\n\n## Contact Information & Footer\n\n" + savedFooter;
  }

  return output;
}

async function discoverAllUrls(): Promise<Set<string>> {
  const urls = new Set<string>(SCRAPER_ROOT_PAGES);

  for (const rootUrl of SCRAPER_ROOT_PAGES) {
    try {
      const html = await fetchHtml(rootUrl);
      const childUrls = extractInternalLinks(html, rootUrl);

      childUrls.forEach((url) => urls.add(url));
      console.log(
        `[Scraper] ${rootUrl} → found ${childUrls.length} child pages`,
      );
    } catch (error) {
      console.error(
        `[Scraper] Failed to discover links from ${rootUrl}`,
        error,
      );
    }
  }

  return urls;
}

function extractInternalLinks(html: string, sourceUrl: string): string[] {
  const base = "https://www.incode-group.com";
  const links: string[] = [];

  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    const isRelative = href.startsWith("/");
    const isAbsolute = href.startsWith(base);

    if (!isRelative && !isAbsolute) continue;

    const fullUrl = isRelative ? `${base}${href}` : href;
    const path = fullUrl.replace(base, "");

    const isCrawlable = SCRAPER_CRAWLABLE_PREFIXES.some((prefix) =>
      path.startsWith(prefix),
    );

    const isClean =
      !path.includes("#") && !path.includes("?") && path.split("/").length <= 4;

    if (isCrawlable && isClean) {
      links.push(fullUrl);
    }
  }

  return [...new Set(links)];
}

async function fetchHtml(url: string, needsJs = false): Promise<string> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(
        `https://api.scrapingrobot.com?token=${SCRAPING_ROBOT_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            module: needsJs ? 'JavaScriptScraper' : 'HtmlRequestScraper',
          }),
          signal: AbortSignal.timeout(30000),
        }
      )

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      
      return data.result ?? ''

    } catch (error) {
      if (attempt === 2) throw error
      console.warn(`[Scraper] Attempt ${attempt} failed for ${url}, retrying...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Unreachable')
}

async function scrapePage(url: string): Promise<{ body: string; footer: string | null } | null> {
  try {
    const html = await fetchHtml(url);
    const result = extractCleanText(html, url);

    if (result.body.length < 100) return null;

    console.log(`[Scraper] ✓ ${url} (${result.body.length} chars)`);
    return result;
  } catch (error) {
    console.error(`[Scraper] ✗ ${url}:`, error);
    return null;
  }
}

function cleanHtmlString(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractCleanText(html: string, url: string): { body: string; footer: string | null } {
  let bodyHtml = html;
  let footerHtml: string | null = null;

  const footerSectionMatch = html.search(/<div[^>]*incode-footer-section[^>]*>/i);
  if (footerSectionMatch > -1) {
    bodyHtml = html.substring(0, footerSectionMatch);
    footerHtml = html.substring(footerSectionMatch);
  }

  const cleanedBody = cleanHtmlString(bodyHtml);
  
  const cleanedFooter = footerHtml ? cleanHtmlString(footerHtml) : null;

  return {
    body: `## Page: ${url}\n\n${cleanedBody}`,
    footer: cleanedFooter
  };
}
