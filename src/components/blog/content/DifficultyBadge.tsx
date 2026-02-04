"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface DifficultyBadgeProps {
  /** Difficulty level */
  level: "beginner" | "intermediate" | "advanced";
  /** Optional override label text */
  label?: string;
}

// ─── Level config ────────────────────────────────────────────────────────────

const levelConfig: Record<
  DifficultyBadgeProps["level"],
  { bg: string; text: string; border: string; dots: string; defaultLabel: string }
> = {
  beginner: {
    bg: "bg-amber-100/80",
    text: "text-amber-700",
    border: "border-amber-200",
    dots: "●○○",
    defaultLabel: "Beginner",
  },
  intermediate: {
    bg: "bg-amber-200/80",
    text: "text-amber-800",
    border: "border-amber-300",
    dots: "●●○",
    defaultLabel: "Intermediate",
  },
  advanced: {
    bg: "bg-amber-800",
    text: "text-amber-50",
    border: "border-amber-900",
    dots: "●●●",
    defaultLabel: "Advanced",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DifficultyBadge({ level, label }: DifficultyBadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="tracking-tight text-[10px] leading-none">{config.dots}</span>
      <span>{label ?? config.defaultLabel}</span>
    </span>
  );
}
