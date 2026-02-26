"use client";

import { Plus } from "lucide-react";
import { useCallHistoryStore } from "../model/useCallHistoryStore";
import { CallHistoryItem } from "./CallHistoryItem";

interface CallHistorySidebarProps {
  onSelect?: () => void;
}

export function CallHistorySidebar({ onSelect }: CallHistorySidebarProps) {
  const { calls, selectedCallId, selectCall } = useCallHistoryStore();

  if (calls.length === 0) return null;

  const handleCallSelect = (id: string) => {
    selectCall(selectedCallId === id ? null : id);
    if (onSelect) onSelect();
  };

  const handleNewChat = () => {
    selectCall(null);
  };

  return (
    <aside
      className="w-full shrink-0 h-full flex flex-col
                      border-r border-white/8 bg-[#171d26]"
    >
      {/* Header */}
       <div className="h-14 px-4 border-b border-white/8 flex items-center justify-between gap-2 shrink-0">
        <h2 className="text-xs uppercase tracking-widest text-[#eeeeef]/40 font-semibold whitespace-nowrap leading-none">
          Call History
        </h2>
        {selectedCallId && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest
                       text-[#72b63b] hover:text-[#8fcf52] transition-colors whitespace-nowrap leading-none"
          >
            <Plus size={14} className="shrink-0" />
            New chat
          </button>
        )}
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
    </aside>
  );
}
