"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BeforePanel {
  /** SQL code (the "wrong" way) */
  code: string;
  /** Optional panel label — defaults to "Before" */
  label?: string;
  /** Optional list of issues with this approach */
  issues?: string[];
}

export interface AfterPanel {
  /** SQL code (the "right" way) */
  code: string;
  /** Optional panel label — defaults to "After" */
  label?: string;
  /** Optional list of improvements */
  improvements?: string[];
}

export interface BeforeAfterProps {
  /** The "wrong" / before panel */
  before: BeforePanel;
  /** The "right" / after panel */
  after: AfterPanel;
  /** Optional caption below the comparison */
  caption?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BeforeAfter({ before, after, caption }: BeforeAfterProps) {
  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Before panel ── */}
        <div className="rounded-xl border border-red-200/60 bg-red-50/30 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100/50 border-b border-red-200/40">
            <span role="img" aria-label="incorrect">❌</span>
            <span className="font-semibold text-sm text-red-800">
              {before.label ?? "Before"}
            </span>
          </div>
          {/* Code */}
          <pre className="p-4 text-sm font-mono text-gray-800 overflow-x-auto leading-relaxed">
            {before.code}
          </pre>
          {/* Issues */}
          {before.issues && before.issues.length > 0 && (
            <div className="px-4 pb-3 space-y-1">
              {before.issues.map((issue, i) => (
                <p key={i} className="text-xs text-red-700/80 flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{issue}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ── After panel ── */}
        <div className="rounded-xl border border-green-200/60 bg-green-50/30 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100/50 border-b border-green-200/40">
            <span role="img" aria-label="correct">✅</span>
            <span className="font-semibold text-sm text-green-800">
              {after.label ?? "After"}
            </span>
          </div>
          {/* Code */}
          <pre className="p-4 text-sm font-mono text-gray-800 overflow-x-auto leading-relaxed">
            {after.code}
          </pre>
          {/* Improvements */}
          {after.improvements && after.improvements.length > 0 && (
            <div className="px-4 pb-3 space-y-1">
              {after.improvements.map((imp, i) => (
                <p key={i} className="text-xs text-green-700/80 flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{imp}</span>
                </p>
              ))}
            </div>
          )}
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
