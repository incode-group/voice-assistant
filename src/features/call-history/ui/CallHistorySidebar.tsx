"use client";

import { useEffect, useState } from "react";
import { useCallHistoryStore } from "../model/useCallHistoryStore";
import { fetchCallTranscript } from "../api/vapiCalls";
import { CallHistoryItem } from "./CallHistoryItem";
import { VapiCallMessage } from "@/types/vapi";

interface CallHistorySidebarProps {
  onSelect?: () => void;
}

export function CallHistorySidebar({ onSelect }: CallHistorySidebarProps) {
  const { calls, selectedCallId, selectCall } = useCallHistoryStore();
  const [transcript, setTranscript] = useState<VapiCallMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!selectedCallId) {
      setTranscript([]);
      return;
    }

    const loadTranscript = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const data = await fetchCallTranscript(selectedCallId);
        setTranscript(data?.messages ?? []);
      } catch (err) {
        console.error("[CallHistory] Failed to load transcript:", err);
        setTranscript([]);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranscript();
  }, [selectedCallId]);

  if (calls.length === 0) return null;

  const handleCallSelect = (id: string) => {
    selectCall(selectedCallId === id ? null : id);
    if (onSelect) onSelect();
  };

  const renderTranscriptContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center gap-2 mt-4 italic">
          <p className="text-[10px] text-[#eeeeef]/30 text-center">
            Loading transcript...
          </p>
        </div>
      );
    }

    if (loadError) {
      return (
        <p className="text-[10px] text-red-400/40 text-center mt-4 italic">
          Transcript not available yet
        </p>
      );
    }

    const filteredMessages = transcript.filter(
      (m) =>
        m.role !== "tool_call_result" &&
        m.role !== "system" &&
        m.role !== "tool_calls"
    );

    if (filteredMessages.length === 0) {
      return (
        <p className="text-[10px] text-[#eeeeef]/20 text-center mt-4">
          No messages found
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {filteredMessages.map((m, i) => {
          const text = m.message || m.content || m.transcript;
          if (!text) return null;

          const isAssistant = m.role === "assistant" || m.role === "bot";

          return (
            <div
              key={i}
              className={`text-[11px] rounded-lg px-2 py-1.5
              ${
                isAssistant
                  ? "bg-[#232b38] text-[#eeeeef]/80"
                  : "bg-[#72b63b]/10 text-[#eeeeef]/60 text-right"
              }`}
            >
              {text}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      className="w-full flex-shrink-0 h-full flex flex-col
                      border-r border-white/8 bg-[#171d26]"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/8 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-[#eeeeef]/40 font-semibold">
          Call History
        </h2>
      </div>

      {/* Call list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {calls.map((call) => (
          <CallHistoryItem
            key={call.id}
            call={call}
            isSelected={selectedCallId === call.id}
            onClick={() => handleCallSelect(call.id)}
          />
        ))}
      </div>

      {/* Transcript preview */}
      {selectedCallId && (
        <div className="border-t border-white/8 p-3 flex-shrink-0 h-1/2 overflow-y-auto bg-black/20 scrollbar-thin">
          <p className="text-[10px] uppercase tracking-widest text-[#eeeeef]/20 mb-3 font-semibold">
            Transcript preview
          </p>
          {renderTranscriptContent()}
        </div>
      )}
    </aside>
  );
}
