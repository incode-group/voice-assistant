import type { TranscriptMessage } from "@/entities/message";
import type { VapiCallMessage } from "@/types/vapi";

export function normalizeHistoryMessages(
  raw: VapiCallMessage[],
): TranscriptMessage[] {
  return raw
    .filter(
      (m): m is VapiCallMessage & { message: string } =>
        (m.role === "bot" || m.role === "user") && !!m.message?.trim(),
    )
    .map((m, i) => ({
      id: `history-${i}`,
      role:
        m.role === "bot" ? "assistant" : ("user" as TranscriptMessage["role"]),
      text: m.message,
      timestamp: new Date(),
      isFinal: true,
      secondsFromStart: m.secondsFromStart,
    }));
}
