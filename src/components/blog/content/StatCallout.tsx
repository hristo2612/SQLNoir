"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface StatCalloutProps {
  /** The big stat (e.g. "90%") */
  stat: string;
  /** What the stat means */
  description: string;
  /** Optional attribution / source */
  source?: string;
  /** Optional emoji icon above the stat */
  icon?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StatCallout({ stat, description, source, icon }: StatCalloutProps) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 shadow-sm px-6 py-6 sm:py-8 text-center">
        {/* Icon */}
        {icon && (
          <span className="block text-3xl mb-2" role="img">
            {icon}
          </span>
        )}

        {/* Stat */}
        <p className="font-detective text-4xl sm:text-5xl font-bold text-amber-900 tracking-tight leading-none">
          {stat}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        {/* Source */}
        {source && (
          <p className="mt-2 text-xs text-amber-600/60">
            {source}
          </p>
        )}
      </div>
    </div>
  );
}
