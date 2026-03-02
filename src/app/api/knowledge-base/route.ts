import { parseKnowledgeBase } from "@/shared/lib/knowledgeBase";
import { NextResponse } from "next/server";

interface VapiFileItem {
  id: string;
  name: string;
  url?: string;
  updatedAt?: string;
}

export async function GET() {
  const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;

  if (!VAPI_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // 1. List all files
    const filesRes = await fetch("https://api.vapi.ai/file", {
      headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` },
      cache: "no-store",
    });

    if (!filesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch files from Vapi" },
        { status: 502 }
      );
    }

    const files = (await filesRes.json()) as VapiFileItem[];
    const file = files.find((f) => f.name === "incode-website-sync.txt");

    if (!file) {
      return NextResponse.json(
        { error: "Knowledge base file not found" },
        { status: 404 }
      );
    }

    // 2. Get download URL — try list item first, fall back to detail endpoint
    let fileUrl = file.url;

    if (!fileUrl) {
      const detailRes = await fetch(`https://api.vapi.ai/file/${file.id}`, {
        headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` },
      });
      const detail = (await detailRes.json()) as VapiFileItem;
      fileUrl = detail.url;
    }

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File download URL not available" },
        { status: 502 }
      );
    }

    // 3. Fetch raw content
    const contentRes = await fetch(fileUrl);
    if (!contentRes.ok) {
      return NextResponse.json(
        { error: "Failed to download file content" },
        { status: 502 }
      );
    }
    const rawContent = await contentRes.text();

    // 4. Parse into sections
    const sections = parseKnowledgeBase(rawContent);

    return NextResponse.json({ sections, updatedAt: file.updatedAt ?? null });
  } catch (err) {
    console.error("[KnowledgeBase] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
