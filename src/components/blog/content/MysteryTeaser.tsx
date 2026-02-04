"use client";

import React from "react";
import { DifficultyBadge } from "./DifficultyBadge";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MysteryTeaserProps {
  /** Case number */
  caseNumber: number;
  /** Case title (e.g. "The Miami Marina Murder") */
  caseTitle: string;
  /** Challenge / hook text */
  challenge: string;
  /** Difficulty level */
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Link to the case */
  href: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MysteryTeaser({
  caseNumber,
  caseTitle,
  challenge,
  difficulty,
  href,
}: MysteryTeaserProps) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-amber-800 bg-amber-900 shadow-md overflow-hidden">
        {/* Case file header */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-amber-950/50 border-b border-amber-700/50">
          <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
            Case File #{String(caseNumber).padStart(3, "0")}
          </span>
          <span className="text-lg" role="img" aria-label="magnifying glass">
            🔍
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* Title + badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-detective text-amber-100 text-lg tracking-wide">
              {caseTitle}
            </h3>
            <DifficultyBadge level={difficulty} />
          </div>

          {/* Challenge hook */}
          <p className="text-amber-200/90 text-sm leading-relaxed">
            {challenge}
          </p>

          {/* CTA */}
          <a
            href={href}
            className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-50 text-sm font-semibold transition-colors shadow-sm"
          >
            Start Investigation
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
