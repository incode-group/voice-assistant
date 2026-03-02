"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, RefreshCw, ChevronDown } from "lucide-react";
import {
  useKnowledgeBaseStore,
  type KBSection,
} from "../model/useKnowledgeBaseStore";

// ─── Content renderer ────────────────────────────────────────────────────────

function ContentRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={i} className="h-2" />;

        if (/^#{1,3}\s*$/.test(trimmed)) return null;

        if (trimmed === "-") return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-sm font-semibold text-[#eeeeef] pt-4 pb-0.5"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-base font-bold text-[#eeeeef] pt-6 pb-1.5 border-b border-white/8 first:pt-0"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-lg font-bold text-[#72b63b] pb-2 first:pt-0"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-[#72b63b] mt-1 shrink-0 text-xs">•</span>
              <p className="text-sm text-[#eeeeef]/65 leading-relaxed">
                {trimmed.slice(2)}
              </p>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm text-[#eeeeef]/65 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ─── Nav item ────────────────────────────────────────────────────────────────

function NavItem({
  section,
  isSelected,
  onClick,
}: {
  section: KBSection;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer
        ${
          isSelected
            ? "bg-[#72b63b]/10 text-[#72b63b] font-medium"
            : "text-[#eeeeef]/50 hover:text-[#eeeeef] hover:bg-white/5"
        }
      `}
    >
      {section.label}
    </button>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export function KnowledgeBaseModal() {
  const { isOpen, sections, isLoading, error, close, fetchSections } =
    useKnowledgeBaseStore();

  const [query, setQuery] = useState("");
  const [manualSelectedUrl, setSelectedUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Escape key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Focus search on open
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => searchRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = () => {
    setQuery("");
    close();
  };

  // Filtered sections
  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q),
    );
  }, [sections, query]);

  const selectedUrl = useMemo(() => {
  if (filteredSections.length === 0) return null;
  const stillValid = filteredSections.some((s) => s.url === manualSelectedUrl);
  return stillValid ? manualSelectedUrl : filteredSections[0].url;
}, [filteredSections, manualSelectedUrl]);

  // Reset content scroll on section change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [selectedUrl]);

  const selectedSection = filteredSections.find((s) => s.url === selectedUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-2 z-50 sm:inset-4 md:inset-8 lg:inset-12
                       flex flex-col rounded-2xl overflow-hidden
                       bg-[#171d26] border border-white/8
                       shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-[#72b63b]" />
                <span className="text-sm font-medium text-[#eeeeef]">
                  Knowledge Base
                </span>
                {!isLoading && sections.length > 0 && (
                  <span className="text-xs text-[#eeeeef]/30">
                    · {sections.length} pages
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Retry / Refresh */}
                {!isLoading && (
                  <button
                    onClick={() => {
                      useKnowledgeBaseStore.setState({ hasFetched: false });
                      fetchSections();
                    }}
                    title="Refresh"
                    className="p-1.5 rounded-lg text-[#eeeeef]/30 hover:text-[#eeeeef]/70
                               hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}

                <button
                  onClick={close}
                  className="w-8 h-8 rounded-full bg-[#232b38] hover:bg-[#2d3748]
                             flex items-center justify-center text-[#eeeeef]/40
                             hover:text-[#eeeeef] transition-colors border border-white/5
                             cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-white/8 shrink-0">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#eeeeef]/30 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search sections…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg
                             pl-8 pr-8 py-2 text-sm text-[#eeeeef]
                             placeholder-[#eeeeef]/30
                             focus:outline-none focus:border-[#72b63b]/50 focus:bg-[#72b63b]/5
                             transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-[#eeeeef]/30 hover:text-[#eeeeef] transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Loading */}
              {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-[#eeeeef]/40">
                    <div
                      className="w-6 h-6 border-2 border-[#72b63b]/30 border-t-[#72b63b]
                                   rounded-full animate-spin"
                    />
                    <span className="text-sm">Loading knowledge base…</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {!isLoading && error && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="flex flex-col items-center gap-3 text-center max-w-xs">
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                      onClick={fetchSections}
                      className="text-xs text-[#72b63b] hover:underline cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              {!isLoading && !error && sections.length > 0 && (
                <>
                  {/* Left nav */}
                  <nav className="hidden md:flex flex-col w-48 xl:w-56 shrink-0 border-r border-white/8 overflow-y-auto p-2 gap-0.5 scrollbar-thin">
                    {filteredSections.length === 0 ? (
                      <p className="px-3 py-4 text-xs text-[#eeeeef]/30 text-center">
                        No matches
                      </p>
                    ) : (
                      filteredSections.map((section) => (
                        <NavItem
                          key={section.url}
                          section={section}
                          isSelected={section.url === selectedUrl}
                          onClick={() => setSelectedUrl(section.url)}
                        />
                      ))
                    )}
                  </nav>

                  {/* Right content */}
                  <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto p-5 md:p-8 scrollbar-thin"
                  >
                    {/* Mobile section selector */}
                    <div className="md:hidden mb-5">
                      <div className="relative">
                        <select
                          value={selectedUrl ?? ""}
                          onChange={(e) => setSelectedUrl(e.target.value)}
                          className="w-full bg-[#232b38] border border-white/10 rounded-lg
                                     px-3 py-2.5 text-sm text-[#eeeeef] appearance-none
                                     focus:outline-none focus:border-[#72b63b]/50 transition-colors cursor-pointer"
                        >
                          {filteredSections.map((s) => (
                            <option
                              key={s.url}
                              value={s.url}
                              className="bg-[#171d26] text-[#eeeeef]"
                            >
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#eeeeef]/30">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    {selectedSection ? (
                      <>
                        {/* Section URL breadcrumb */}
                        <p className="text-[10px] uppercase tracking-widest text-[#72b63b]/70 mb-4 font-mono">
                          {selectedSection.url}
                        </p>
                        <ContentRenderer text={selectedSection.content} />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-[#eeeeef]/30">
                          Select a section to read
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
