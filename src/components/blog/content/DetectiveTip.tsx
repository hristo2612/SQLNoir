"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface DetectiveTipProps {
  /** Callout title — defaults to "Detective's Note" */
  title?: string;
  /** Tip content (supports rich text/JSX) */
  children: React.ReactNode;
  /** Visual variant */
  variant?: "tip" | "warning" | "clue";
}

// ─── Variant config ──────────────────────────────────────────────────────────

const variantConfig: Record<
  NonNullable<DetectiveTipProps["variant"]>,
  { icon: string; bg: string; border: string; accent: string; title: string }
> = {
  tip: {
    icon: "🕵️",
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    accent: "border-l-amber-400",
    title: "Detective\u2019s Note",
  },
  warning: {
    icon: "⚠️",
    bg: "bg-amber-100/50",
    border: "border-amber-300",
    accent: "border-l-amber-600",
    title: "Watch Out",
  },
  clue: {
    icon: "🔍",
    bg: "bg-amber-50/80",
    border: "border-amber-300",
    accent: "border-l-yellow-500",
    title: "Key Clue",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DetectiveTip({
  title,
  children,
  variant = "tip",
}: DetectiveTipProps) {
  const config = variantConfig[variant];

  return (
    <div className="not-prose my-8">
      <div
        className={`rounded-xl border ${config.border} ${config.bg} border-l-4 ${config.accent} shadow-sm px-5 py-4`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg" role="img">
            {config.icon}
          </span>
          <span className="font-detective font-bold text-amber-900 text-sm tracking-wide">
            {title ?? config.title}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 leading-relaxed [&_code]:font-mono [&_code]:text-xs [&_code]:bg-amber-100/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_a]:text-amber-700 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}
