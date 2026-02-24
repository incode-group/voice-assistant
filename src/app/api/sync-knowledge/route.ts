import { NextResponse } from "next/server";
import { scrapeIncodeWebsite } from "@/shared/lib/scraper";
import { syncVapiKnowledgeBase } from "@/shared/lib/vapi-sync";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[SyncKnowledge] Starting website sync...");

    const content = await scrapeIncodeWebsite();

    if (!content || content.length < 500) {
      throw new Error("Scraped content too short — possible scraping failure");
    }

    const newFileId = await syncVapiKnowledgeBase(content);

    return NextResponse.json({
      success: true,
      newFileId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SyncKnowledge] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
