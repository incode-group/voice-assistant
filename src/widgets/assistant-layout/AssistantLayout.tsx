"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History } from "lucide-react";
import {
  VoiceOrb,
  VoiceControls,
  useVoiceAgentStore,
} from "@/features/voice-agent";
import { TranscriptPanel } from "@/features/chat-transcript";
import { BookingButton, BookingModal, EmailInput } from "@/features/booking";
import { CallHistorySidebar, useCallHistoryStore } from "@/features/call-history";

export function AssistantLayout() {
  const { agentState, errorMessage } = useVoiceAgentStore();
  const { calls } = useCallHistoryStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hasHistory = calls.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#171d26] text-white overflow-hidden">
      {/* Header */}
      <header
        className="shrink-0 flex items-center justify-between
                         px-6 md:px-8 py-4 border-b border-white/8 relative z-50 bg-[#171d26]"
      >
        <div className="flex items-center gap-3">
          {hasHistory && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors text-[#eeeeef]/60 hover:text-[#eeeeef]"
            >
              <History size={20} />
            </button>
          )}

          <div
            className="w-7 h-7 rounded-lg bg-[#72b63b] flex items-center
                           justify-center text-xs font-bold select-none text-white"
          >
            I
          </div>
          <div>
            <div className="text-sm font-medium text-[#eeeeef]">
              Incode Assistant
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#72b63b]">
              Voice Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                  ${
                    agentState === "speaking"
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
          <div
            className={`
              fixed inset-y-0 left-0 z-40 w-64 pt-[72px] lg:pt-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-10 bg-[#171d26]
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <CallHistorySidebar />
          </div>
        )}
        
        <main className="flex flex-1 overflow-hidden relative">
          {/* Left Column (Orb & Controls) */}
          <div
            className="flex flex-1 flex-col items-center justify-center gap-8
                         px-6 lg:border-r border-white/8 min-w-0"
          >
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

          {/* Right Column */}
          <div className="hidden lg:flex flex-col lg:w-[340px] xl:w-2/5 shrink-0 min-w-[320px] overflow-hidden">
            <TranscriptPanel />
          </div>
        </main>
      </div>

      {/* Mobile/Tablet Transcript */}
      <div className="lg:hidden shrink-0 h-[35vh] md:h-[30vh] border-t border-white/8 bg-[#171d26] overflow-hidden">
        <TranscriptPanel />
      </div>

      <BookingModal />
      <EmailInput />
    </div>
  );
}
