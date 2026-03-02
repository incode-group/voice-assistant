"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, BookOpen } from "lucide-react";
import {
  VoiceOrb,
  VoiceControls,
  useVoiceAgentStore,
} from "@/features/voice-agent";
import { TranscriptPanel } from "@/features/chat-transcript";
import { BookingButton, BookingModal, EmailInput } from "@/features/booking";
import {
  CallHistorySidebar,
  HistoryTranscriptView,
  useCallHistoryStore,
} from "@/features/call-history";
import {
  KnowledgeBaseModal,
  useKnowledgeBaseStore,
} from "@/features/knowledge-base";

export function AssistantLayout() {
  const { agentState, errorMessage } = useVoiceAgentStore();
  const { calls, selectedCallId, _hasHydrated } = useCallHistoryStore();
  const { open: openKnowledgeBase } = useKnowledgeBaseStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hasHistory = _hasHydrated && calls.length > 0;
  const isViewingHistory = _hasHydrated && selectedCallId !== null;

  return (
    <div className="flex flex-col h-screen bg-[#171d26] text-white overflow-hidden">

      {/* Header */}
      <header className="shrink-0 h-18 flex items-center justify-between gap-2
                         px-3 sm:px-4 md:px-8 border-b border-white/8 relative z-50 bg-[#171d26]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {hasHistory && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 hover:bg-white/5 rounded-lg transition-colors text-[#eeeeef]/60 hover:text-[#eeeeef] shrink-0 cursor-pointer"
            >
              <History size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#72b63b] flex items-center
                          justify-center text-[10px] sm:text-xs font-bold select-none text-white shrink-0">
            I
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="text-sm font-medium text-[#eeeeef] truncate whitespace-nowrap leading-tight">
              Incode Assistant
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#72b63b] truncate whitespace-nowrap leading-tight">
              Voice Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <motion.button
            onClick={openKnowledgeBase}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full
                       px-3 sm:px-5 h-9 sm:h-10 text-xs sm:text-sm font-medium
                       transition-colors duration-200 shrink-0 whitespace-nowrap
                       bg-[#232b38] hover:bg-[#2d3748] text-[#eeeeef]/60
                       hover:text-[#eeeeef] border border-white/10 cursor-pointer"
          >
            <BookOpen size={16} className="text-[#eeeeef]/40" />
            <span className="hidden sm:inline">Knowledge Base</span>
            <span className="sm:hidden">KB</span>
          </motion.button>
          <BookingButton />
          <AnimatePresence>
            {agentState !== "idle" && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className={`
                  hidden md:flex items-center gap-1.5
                  text-xs uppercase tracking-widest px-3 py-1.5
                  rounded-full border
                  ${agentState === "speaking"
                    ? "text-[#72b63b] border-[#72b63b]/30 bg-[#72b63b]/10"
                    : agentState === "listening"
                      ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                      : "text-[#eeeeef]/40 border-white/10"
                  }
                `}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {agentState}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && hasHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Wrapper */}
        {hasHistory && (
          <div className={`
            fixed inset-y-0 left-0 z-40 w-64 pt-18 lg:pt-0
            transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 lg:z-10 bg-[#171d26]
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <CallHistorySidebar onSelect={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {/* History view */}
        {_hasHydrated && isViewingHistory && (
          <main className="flex flex-1 overflow-hidden relative">
            <HistoryTranscriptView />
          </main>
        )}

        {/* Voice assistant view */}
        {_hasHydrated && !isViewingHistory && (
          <main className="flex flex-1 overflow-hidden relative flex-col lg:flex-row">
            {/* Left Column (Orb & Controls) */}
            <div className="flex flex-1 flex-col items-center justify-center
                            px-6 lg:border-r border-white/8 min-w-0">
              <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto lg:flex-1">
                <VoiceOrb size={280} />

                <div className="mt-16 w-full flex justify-center">
                  <VoiceControls />
                </div>

                <AnimatePresence>
                  {agentState === "error" && errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4 text-xs text-red-400 text-center max-w-xs"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop transcript */}
            <div className="hidden lg:flex flex-col lg:w-85 xl:w-2/5 shrink-0 min-w-[320px] overflow-hidden">
              <TranscriptPanel />
            </div>

            {/* Mobile/Tablet Transcript */}
            <div className="lg:hidden shrink-0 h-[40vh] border-t border-white/8 bg-[#171d26] overflow-hidden">
              <TranscriptPanel />
            </div>
          </main>
        )}
      </div>

      <BookingModal />
      <EmailInput />
      <KnowledgeBaseModal />
    </div>
  );
}
