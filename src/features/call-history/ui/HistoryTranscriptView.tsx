"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCallHistoryStore } from "../model/useCallHistoryStore";
import { fetchCallTranscript } from "../api/vapiCalls";
import { normalizeHistoryMessages } from "../api/normalizeMessages";
import { TranscriptMessage as TranscriptMessageComponent } from "@/features/chat-transcript";
import type { TranscriptMessage } from "@/entities/message";
import { TranscriptSkeleton } from "./TranscriptSkeleton";

export function HistoryTranscriptView() {
  const { selectedCallId, calls } = useCallHistoryStore();
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const selectedCall = calls.find((c) => c.id === selectedCallId);

  useEffect(() => {
    if (!selectedCallId) {
      setTranscript([]);
      return;
    }

    const loadTranscript = async () => {
      setIsLoading(true);
      setLoadError(false);
      setTranscript([]); // clear previous before loading new
      try {
        const data = await fetchCallTranscript(selectedCallId);
        const normalized = normalizeHistoryMessages(data?.messages ?? []);
        setTranscript(normalized);
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

  if (!selectedCallId) return null;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-white/8">
        <p className="text-xs uppercase tracking-widest text-[#eeeeef]/40 font-semibold">
          Call Transcript
        </p>
        {selectedCall && (
          <h2 className="text-sm font-medium text-[#eeeeef] mt-1">
            {selectedCall.title}
          </h2>
        )}
      </div>

      {/* Transcript content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        {isLoading && <TranscriptSkeleton />}

        {loadError && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-red-400/60 italic">
              Transcript not available yet
            </p>
          </div>
        )}

        {!isLoading && !loadError && transcript.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-[#eeeeef]/20">No messages found</p>
          </div>
        )}

        {!isLoading && !loadError && transcript.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {transcript.map((msg) => (
              <TranscriptMessageComponent key={msg.id} message={msg} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}