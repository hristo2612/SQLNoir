"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CheatSheetItem {
  /** Term or concept name */
  term: string;
  /** SQL syntax in monospace */
  syntax: string;
  /** Optional code example */
  example?: string;
  /** Optional description */
  description?: string;
}

export interface CheatSheetCardProps {
  /** Card title */
  title: string;
  /** Reference items */
  items: CheatSheetItem[];
  /** Optional caption below the card */
  caption?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CheatSheetCard({ title, items, caption }: CheatSheetCardProps) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border-2 border-amber-300 bg-amber-50/50 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-amber-800 px-5 py-3">
          <h3 className="font-detective text-amber-50 text-base sm:text-lg tracking-wide">
            {title}
          </h3>
        </div>

        {/* Items */}
        <div className="divide-y divide-amber-100">
          {items.map((item, i) => (
            <div key={i} className="px-5 py-3.5 space-y-1.5">
              {/* Term + syntax */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-amber-900 text-sm shrink-0">
                  {item.term}
                </span>
                <code className="font-mono text-xs sm:text-sm text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                  {item.syntax}
                </code>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Example */}
              {item.example && (
                <pre className="mt-1 p-2.5 rounded-lg bg-amber-900/5 border border-amber-200/60 text-xs font-mono text-gray-700 overflow-x-auto">
                  {item.example}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <p className="mt-3 text-center text-sm text-amber-700/80 font-detective tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
