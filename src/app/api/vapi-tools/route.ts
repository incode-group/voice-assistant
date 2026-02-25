import { NextRequest, NextResponse } from "next/server";
import { VapiPayload } from "@/types/vapi";
import { SHOW_EMAIL_TOOLS } from "@/shared/config/constants";

function extractToolCall(body: VapiPayload) {
  const toolCall = body?.message?.toolCallList?.[0];
  return {
    toolCallId: toolCall?.id ?? "unknown",
    toolName: toolCall?.function?.name ?? body?.message?.functionCall?.name,
    args: (() => {
      const raw =
        toolCall?.function?.arguments ??
        body?.message?.functionCall?.parameters ??
        {};
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    })(),
  };
}

function respond(toolCallId: string, result: string) {
  return NextResponse.json({
    results: [{ toolCallId, result }],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { toolCallId, toolName } = extractToolCall(body);

  console.log("[VapiTools]", toolName);

  try {
    if (toolName && (SHOW_EMAIL_TOOLS as readonly string[]).includes(toolName)) {
      return respond(toolCallId, "Email input field is now shown in the chat.");
    }

    return respond(toolCallId, "Unknown tool.");
  } catch (error) {
    console.error("[VapiTools] Error:", error);
    return respond(toolCallId, "Technical issue occurred. Please try again.");
  }
}
