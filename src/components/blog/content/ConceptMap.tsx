"use client";

import React from "react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ConceptConnection {
  /** Connected concept label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional relation label on the connection line */
  relation?: string;
}

export interface ConceptMapProps {
  /** The central concept */
  centerNode: string;
  /** Connected concepts */
  connections: ConceptConnection[];
  /** Optional caption below the map */
  caption?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ConceptMap({ centerNode, connections, caption }: ConceptMapProps) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm p-5 sm:p-8">
        {/* ── Desktop: radial layout ── */}
        <div className="hidden md:block">
          <div className="relative mx-auto" style={{ width: 400, height: 400 }}>
            {/* Center node */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="px-5 py-3 rounded-full bg-amber-800 text-amber-50 font-detective font-bold text-base tracking-wide shadow-md text-center whitespace-nowrap">
                {centerNode}
              </div>
            </div>

            {/* Connection nodes arranged in a circle */}
            {connections.map((conn, i) => {
              const total = connections.length;
              const angle = (2 * Math.PI * i) / total - Math.PI / 2;
              const radius = 160;
              const x = 200 + radius * Math.cos(angle);
              const y = 200 + radius * Math.sin(angle);

              return (
                <React.Fragment key={i}>
                  {/* Connecting line (SVG) */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    width="400"
                    height="400"
                    style={{ zIndex: 1 }}
                  >
                    <line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {/* Relation label on the line */}
                    {conn.relation && (
                      <text
                        x={(200 + x) / 2}
                        y={(200 + y) / 2 - 6}
                        textAnchor="middle"
                        className="fill-amber-600 text-[10px]"
                      >
                        {conn.relation}
                      </text>
                    )}
                  </svg>

                  {/* Node */}
                  <div
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: x, top: y }}
                  >
                    <div className="px-3 py-2 rounded-lg bg-white border border-amber-200 shadow-sm text-center max-w-[130px]">
                      <span className="block text-sm font-semibold text-amber-900">
                        {conn.label}
                      </span>
                      {conn.description && (
                        <span className="block mt-0.5 text-[11px] text-gray-500 leading-tight">
                          {conn.description}
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: vertical list ── */}
        <div className="md:hidden flex flex-col items-center gap-0">
          {/* Center node */}
          <div className="px-5 py-3 rounded-full bg-amber-800 text-amber-50 font-detective font-bold text-base tracking-wide shadow-md text-center">
            {centerNode}
          </div>

          {/* Connections */}
          {connections.map((conn, i) => (
            <React.Fragment key={i}>
              {/* Connecting line */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-amber-300" />
                {conn.relation && (
                  <span className="text-[10px] text-amber-600 -my-0.5">
                    {conn.relation}
                  </span>
                )}
                <div className="w-0.5 h-2 bg-amber-300" />
              </div>

              {/* Node */}
              <div className="px-4 py-2 rounded-lg bg-white border border-amber-200 shadow-sm text-center max-w-[200px]">
                <span className="block text-sm font-semibold text-amber-900">
                  {conn.label}
                </span>
                {conn.description && (
                  <span className="block mt-0.5 text-xs text-gray-500 leading-tight">
                    {conn.description}
                  </span>
                )}
              </div>
            </React.Fragment>
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
