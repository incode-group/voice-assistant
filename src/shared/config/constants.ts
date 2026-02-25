export const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
export const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;

export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

if (!VAPI_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not defined");
}

export const SCRAPER_ROOT_PAGES = [
  "https://www.incode-group.com/",
  "https://www.incode-group.com/solutions",
  "https://www.incode-group.com/services",
  "https://www.incode-group.com/projects",
  "https://www.incode-group.com/about",
  "https://www.incode-group.com/hiring-calculator",
] as const;

export const SCRAPER_CRAWLABLE_PREFIXES = [
  "/services/",
  "/solutions/",
  "/projects/",
] as const;

export const SHOW_EMAIL_TOOLS = [
  "showEmailInput",
  "showEmailInput-dev",
] as const;
