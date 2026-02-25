"use client";

import { useEffect, useCallback, useRef } from "react";
import { getVapiClient } from "@/shared/lib/vapi";
import { VAPI_ASSISTANT_ID } from "@/shared/config/constants";
import { useVoiceAgentStore } from "./voiceStore";
import { useTranscriptStore } from "@/features/chat-transcript/model/transcriptStore";
import type { VapiMessage } from "@/entities/message";
import { useBookingStore } from "@/features/booking";
import { useCallHistoryStore } from "@/features/call-history";
import { generateCallTitle } from "@/features/call-history/api/vapiCalls";

import {
  AnyVapiMessage,
  VapiToolCallMessage,
  VapiFunctionCallMessage,
} from "@/types/vapi";

const openEmailInput = () => {
  useBookingStore.getState().openEmailInput();
};

const TOOL_HANDLERS: Record<string, () => void> = {
  showEmailInput: openEmailInput,
  "showEmailInput-dev": openEmailInput,
  openBooking: () => {
    useBookingStore.getState().open();
  },
};

const BOOKING_KEYWORDS = ["book", "schedule", "calendar", "discovery call"];

export function useVapiSession() {
  const {
    setAgentState,
    setActiveCallId,
    setAudioLevel,
    setError,
    setMuted,
    isMuted,
    reset,
  } = useVoiceAgentStore();

  const { addMessage, updateLastPartial, setBookingIntent, clearTranscript } =
    useTranscriptStore();

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        getVapiClient().stop();
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const vapi = getVapiClient();

    const onCallStart = (call?: { id?: string }) => {
      setAgentState("listening");

      if (call?.id) {
        setActiveCallId(call.id);
      }
    };

    const onCallEnd = async () => {
      const messages = [...useTranscriptStore.getState().messages];
      const callId = useVoiceAgentStore.getState().activeCallId;

      const savedMessages = messages.filter((m) => m.isFinal);
      const savedCallId = callId;

      reset();
      clearTranscript();
      useBookingStore.getState().reset();

      if (savedCallId && savedMessages.length > 0) {
        try {
          const title = await generateCallTitle(savedMessages);
          const preview =
            savedMessages.find((m) => m.role === "user")?.text ?? "";

          useCallHistoryStore.getState().addCall({
            id: savedCallId,
            title,
            date: new Date().toISOString(),
            preview,
          });
        } catch (err) {
          console.error("[CallEnd] Failed to save history:", err);
        }
      }
    };

    const onSpeechStart = () => setAgentState("speaking");
    const onSpeechEnd = () => setAgentState("listening");
    const onVolumeLevel = (volume: number) => setAudioLevel(volume);

    const onMessage = (raw: AnyVapiMessage) => {
      switch (raw.type) {
        case "transcript": {
          const message = raw as VapiMessage;
          if (!message.transcript || !message.role) break;

          const role = message.role === "assistant" ? "assistant" : "user";

          if (message.transcriptType === "partial") {
            updateLastPartial(message.transcript, role);
          } else {
            addMessage({
              id: `${Date.now()}-${role}`,
              role,
              text: message.transcript,
              timestamp: new Date(),
              isFinal: true,
            });
          }

          if (message.role === "assistant") {
            const text = message.transcript.toLowerCase();
            if (BOOKING_KEYWORDS.some((kw) => text.includes(kw))) {
              setBookingIntent(true);
            }
          }
          break;
        }

        case "tool-calls": {
          const message = raw as VapiToolCallMessage;
          message.toolCallList?.forEach((tool) => {
            TOOL_HANDLERS[tool?.function?.name]?.();
          });
          break;
        }

        case "function-call": {
          const message = raw as VapiFunctionCallMessage;
          const name = message.functionCall?.name;
          if (name) TOOL_HANDLERS[name]?.();
          break;
        }
      }
    };

    const onError = (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Unknown Vapi error";
      setError(msg);
      console.error("[Vapi Error]", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("message", onMessage as (msg: VapiMessage) => void);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("message", onMessage as (msg: VapiMessage) => void);
      vapi.off("error", onError);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startCall = useCallback(async () => {
    try {
      const vapi = getVapiClient();
      setAgentState("connecting");

      const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date().toLocaleString("en-US", {
        timeZone: clientTimezone,
      });

      const call = await vapi.start(VAPI_ASSISTANT_ID, {
        variableValues: { clientTimezone, now },
      });

      if (call?.id) {
        setActiveCallId(call.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start call");
    }
  }, [setAgentState, setError, setActiveCallId]);

  const stopCall = useCallback(() => {
    getVapiClient().stop();
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    getVapiClient().setMuted(next);
    setMuted(next);
  }, [setMuted]);

  return { startCall, stopCall, toggleMute };
}
