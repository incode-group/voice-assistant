"use client";

import { useRef, useEffect } from "react";
import { useVoiceAgentStore } from "../model/voiceStore";
import type { VoiceAgentState } from "../model/voiceStore";

const COLORS: Record<VoiceAgentState, string> = {
  idle:       '#72b63b',
  speaking:   '#8fcf52',
  listening:  '#5a9e2f',
  connecting: '#4a5568',
  error:      '#ef4444',
}

export function VoiceOrb({ size = 400 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { agentState, audioLevel } = useVoiceAgentStore();

  const stateRef = useRef(agentState);
  const levelRef = useRef(audioLevel);

  useEffect(() => {
    stateRef.current = agentState;
  }, [agentState]);
  useEffect(() => {
    levelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let time = 0;

    const render = () => {
      const state = stateRef.current;
      const level = levelRef.current;

      const timeStep = state === "speaking" ? 0.08 : 0.04;
      time += timeStep;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = size * 0.28;
      const color = COLORS[state];

      if (state === "speaking" && level > 0.1) {
        const s = 1 + level * 0.04;
        ctx.setTransform(s, 0, 0, s, cx * (1 - s), cy * (1 - s));
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      ctx.globalCompositeOperation = "screen";

      const layers = state === "speaking" ? 6 : 3;

      for (let layer = 0; layer < layers; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = layer === 0 ? 2.5 : 0.8;
        ctx.globalAlpha = layer === 0 ? 1 : 0.2 + 0.1 * layer;

        if (layer === 0) {
          ctx.shadowBlur = 15 + level * 25; // Radiance responds to volume
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }

        const points = state === "speaking" ? 120 : 80; // More points for detailing waves

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;

          // Main wave
          let wave = Math.sin(angle * 4 + time + layer) * (5 + level * 30);

          if (state === "speaking") {
            wave += Math.sin(angle * 12 + time * 2) * (level * 15);
            wave += Math.cos(angle * 8 - time) * (level * 10);
          }

          const noise = Math.cos(angle * 3 - time * 0.5) * (2 + level * 15);
          const r =
            baseRadius + wave + noise + layer * (state === "speaking" ? 8 : 4);

          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";

        ctx.closePath();
        ctx.stroke();
      }

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative z-10 transition-transform duration-200"
      />

      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          backgroundColor: COLORS[agentState],
          filter: "blur(80px)",
          opacity: agentState === "speaking" ? 0.25 + audioLevel * 0.4 : 0.15,
          transform: `scale(${1 + audioLevel * 0.2})`,
        }}
      />
    </div>
  );
}
